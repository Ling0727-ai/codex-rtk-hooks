---
name: codex-rtk-hooks
description: Use RTK to reduce verbose shell output and diagnose RTK hook guidance in Codex.
---

Use installed RTK wrappers for supported shell commands, such as rtk git status or rtk cargo test. Use rtk proxy for commands without a specialized wrapper. Preserve quoting, working directory and command semantics. This plugin supplies a Codex PreToolUse hook that checks RTK suggestions and adds guidance. It does not automatically execute rewrites or rewrite permission decisions. If RTK is unavailable it lets the command proceed. Codex requires the user to review and trust installed hooks before they run; do not alter trust state programmatically.

The DSH post-execute arbitrary-output replacement has no equivalent in this adapter. Obtain output reduction by executing the appropriate RTK wrapper directly.
