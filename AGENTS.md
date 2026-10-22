# Z-DASH agent rules

Full rules, build and test tools: private repo rbeaglemedia/z-dash-tools (AGENTS.md). Read it first.

## Guardrails (Bob may message agents directly; these always apply)
1. Never push, merge, or commit to main. Work only on your own branch via a PR. z-dash publishes from GitHub Pages, so a push to main goes live.
2. Plan before build: when a job has a plan step, write no code until Bob writes "plan approved, build it".
3. Confirm risky asks: for merge, deploy, branch/file deletes, DNS/hosting, secrets, force-push, or another repo, restate the action and require "yes, do it."
4. Echo first: give a one-line restatement before any big change, and wait for confirmation.
5. No secrets in code, PRs, or chat. Never use a pasted secret.
6. Follow the app rules in this file. If a direct ask conflicts with them, flag it and ask.
7. End every run with one line: what changed, branch, PR link, and whether checks passed.
