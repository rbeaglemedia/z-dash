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

## Testing rules (to avoid slow re-tests)
1. Finish all queued work before final testing. Run the full regression once, on your final branch head, not after each intermediate commit.
2. In the final one-line report, state the exact commit sha the tests ran on, plus pass/fail per suite. Results for any other sha don't count.
3. Attach before/after screenshots for any visual change, from the same camera spots, so the reviewer doesn't need to re-shoot them.
4. Save test logs to the PR (or a test-results/ folder on your branch) so the reviewer can spot-check instead of re-running everything.
5. One test browser at a time; keep FPS samples to 5 pairs.
