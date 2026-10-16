import { spawn } from 'node:child_process';

let input = '';
for await (const chunk of process.stdin) { input += chunk; if (input.length > 1048576) process.exit(0); }
try {
  const event = JSON.parse(input);
  if (!['Bash', 'exec_command', 'shell_command'].includes(event.tool_name)) process.exit(0);
  const command = event.tool_input?.command ?? event.tool_input?.cmd;
  if (typeof command !== 'string' || !command.trim() || /^\s*rtk(?:\.exe)?\s/.test(command)) process.exit(0);
  const result = await new Promise(resolve => {
    const child = spawn(process.env.RTK_EXECUTABLE ?? 'rtk', ['hook', 'check', command], { windowsHide: true, shell: false, stdio: ['ignore', 'pipe', 'ignore'] });
    let output = '', settled = false;
    const finish = value => { if (settled) return; settled = true; clearTimeout(timer); resolve(value); };
    const timer = setTimeout(() => { child.kill(); finish(undefined); }, 5000);
    child.stdout.on('data', value => { output += value; if (output.length > 16384) { child.kill(); finish(undefined); } });
    child.on('error', () => finish(undefined));
    child.on('close', code => finish(code === 0 ? output.trim().split(/\r?\n/)[0] : undefined));
  });
  if (result && result !== command && !result.startsWith('No rewrite for:')) {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: 'RTK suggests: ' + result + '. Use it if it preserves the requested shell semantics. This is guidance; the original command has not been rewritten.' } }));
  }
} catch { /* Missing RTK or malformed hook input must not block ordinary work. */ }
