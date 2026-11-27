# How I build with AI — Tucker Craig

> How Tucker Craig splits work across Gemini 4 Neon, Claude Opus 5.5, GPT-6.2 Sol, local Qwen 3.8, and a five-model blind council to build and test his own apps.

Canonical: https://btuckerc.dev/workflow

## How I build with AI

I split work across different models instead of asking one chat window to design, code, and grade its own work. One model directs, sandboxed workers write patches in separate copies of the repo, a five-model blind council checks big changes, and I test the built app myself.

## Start with what you use

Most of the projects here started with a tool I use every day that didn't quite fit how I work. It's fast enough now to build a smaller, focused version instead of working around it.

Everything is solvable. It's something that hit me while I was putting this together. Every single problem is solvable right now, all it takes is someone pointing their tokens in the right place. People are proving [the Riemann hypothesis](https://leanprover-community.github.io/blog/posts/riemann-hypothesis/), building Linux distros, and shipping everyday software simply by deciding to put some of their agentic bandwidth toward a problem.

Lately for me that's been a lightweight Mac browser ([angl browser](https://github.com/btuckerc/angl-browser)), a Rust streaming app for Windows (winstream) that uses about a third as much memory as OBS, an iPhone app ([Herdwick](https://github.com/btuckerc/herdwick)) for checking on coding agents over SSH, local voice-to-text on Mac ([Dictation](https://github.com/btuckerc/dictation)), a menu bar usage tracker ([Pace Bar](https://github.com/btuckerc/pace-bar)), an iPhone puzzle game ([Inkjoin](https://github.com/btuckerc/inkjoin)), and handheld firmware ([omalo](https://btuckerc.dev/projects/omalo)).

## Right model for the job

I treat models like specialists with clear handoffs. Either Gemini 4 Neon (in Antigravity) or Claude Opus 5.5 (in Claude Code) sits at the top as the director. It works out the design with me, writes short briefs, applies the finished patches, and runs the final checks.

Both directors share one ruleset from my [boilerplate](https://github.com/btuckerc/boilerplate) dotfiles and delegate through a small Python wrapper called `agent-run`. Hard changes go to GPT-6.2 Sol in its own Git worktree. Smaller bounded edits go to a local Qwen 3.8 27B model running on my Linux box (`nous`, Radeon AI PRO R9700 32 GB VRAM, vLLM with a DFlash2 drafter) inside a `bwrap` sandbox with read/edit tools only and no shell access. Quick summaries go to GPT-6 Luna.

Every worker run writes a receipt that inspects the child's own transcript afterward (`model_ok`, `effort_ok`, `sandbox_ok`) so a silent model downgrade, wrong reasoning effort, or stray tool call fails the receipt instead of slipping by.

current model stack 3 cloud families + 1 local GPU · click a plane

Google (Neon) Anthropic (Opus, Fable) OpenAI (Sol, Astra, Luna) Local GPU (Qwen 3.8)

Two peer directors own the plan and the final build

One model sits with me as the lead. We decide how a feature should work, split it into small briefs, review every patch, and run the built app.

Both directors share one ruleset from my dotfiles and delegate through one wrapper (agent-run), never loose subagents. They never grade their own big changes.

- Gemini 4 Neon high Antigravity (agy) Primary director for daily work, prose, design, and verification.
- Claude Opus 5.5 high Claude Code Peer director for coordinating multi-step work and overall product quality.

Director rule verified

- **owns**: Requirements, briefs, patch apply, real app check

- **guard**: PreToolUse hook blocks nested or detached launches

Isolated workers write patches in clean copies of the repo

Each coding job runs in its own copy of the codebase so parallel work never collides. Hard tasks go to the cloud; small edits run on my home GPU.

After every run, agent-run checks the worker transcript to confirm the exact model, effort, and sandbox actually ran. Local Qwen gets read/edit tools only, with no shell access.

- GPT-6.2 Sol high agent-run sol · worktree Detail-oriented worker for hard changes in an isolated Git worktree. Returns result.patch.
- Qwen 3.8 27B local GPU nous · Radeon R9700 · bwrap Bounded edits on my Linux box (vLLM + DFlash2). Read/edit only; I run checks.
- GPT-6 Luna low agent-run ask --model luna Fast, cheap extraction and bounded summaries.

Transcript receipt (~/.local/state/agent-runs) verified

- **check**: model_ok: true · effort_ok: true · sandbox_ok: true

- **note**: Local bwrap is runner-attested; cloud checks rollout/API log

Five blind reviewers plus a strict release auditor

Before big changes ship, five models from three companies inspect the exact same frozen snapshot without seeing each other. High-stakes commits also get a pass/fail audit.

Agreement between models is not proof because reviewer precision is low. I verify every finding in code or tests, send disputed declines to a fresh Opus tiebreaker, and run the real app.

- Full Council 5 seats · 3 families Sol · Opus · Fable · Astra · Neon Read-only JSON review of a frozen git archive snapshot. Loops until done or plateau.
- GPT-6.2 Sol xhigh · audit agent-run audit · read-only Strict PASS / BLOCK / UNVERIFIED gate on one exact commit. Stops at counterexamples.

Merge gate verified

- **blind**: Frozen git archive · no other seats, no score targets

- **ship**: Real build run like a user clears merge, not test green alone

## Five models, blind review

The easiest mistake with coding agents is asking the model that wrote a diff whether the diff looks good. For big changes or tricky design calls, I run a full council (adapted from Theo Browne's `council` and `sol-loop`): five read-only seats across three model families, each given a slightly different review prompt.

Every seat reads the same frozen `git archive` snapshot and diff. Nobody sees another seat's findings, my reasoning, or whether I have a target score in mind. Independent first opinions carry most of the value, and reviewer precision is still low even with strong models, so agreement between seats is never proof. I check every claim against the code or write a test before fixing or declining it.

If a seat still disagrees after I send back counter-evidence, a fresh Claude Opus 5.5 tiebreaker sees only the claim, evidence, and both sides. I wrote the code, so I don't get to rule on my own decline. On high-stakes commits, a strict read-only GPT-6.2 Sol (`xhigh`) audit also runs last and only clears the boundary on concrete evidence.

full council · 5 seats, 3 families blind review · click a seat

GPT-6.2 Sol xhigh OpenAI

Detail-oriented. Good at catching small mistakes and edge cases that are easy to gloss over.

**Council prompt:** In council, its brief asks it to try to make the change fail with concrete inputs.

Illustrative round-1 JSON · Sol 8.4 · CHANGES

- **risk**: Filter helper exits before flushing compiled rule cache on rapid reload.

- **raise**: Atomic rename on the compiled rule file plus a reload race test.

- **proof**: rollout · model_ok · effort_ok · sandbox_ok

Claude Opus 5.5 high Anthropic

Strong at coordinating multi-step work and consistently high quality in the finished product.

**Council prompt:** In council, its brief asks it to question assumptions in the review packet.

Illustrative round-1 JSON · Opus 8.6 · CHANGES

- **risk**: Benchmark script measured idle process after cache warmup, not cold startup.

- **raise**: Include cold-start capture output in the verification packet.

- **proof**: api-log · model_ok · effort_ok · tool-allowlist

Claude Fable high Anthropic

Strong eye for design and visual polish alongside Neon.

**Council prompt:** In council, its brief asks what can be simplified or cut.

Illustrative round-1 JSON · Fable 9.1 · APPROVE

- **risk**: Fallback queue wrapper adds 90 lines for a single caller.

- **raise**: Inline the retry loop and drop the extra queue type.

- **proof**: api-log · model_ok · effort_ok · tool-allowlist

GPT-6.2 Astra high OpenAI

I haven't been burning through my Codex subscription lately, so Astra puts those spare tokens to work as another independent review.

**Council prompt:** In council, its brief asks it to walk through real end-to-end use.

Illustrative round-1 JSON · Astra 8.8 · CHANGES

- **risk**: SSH reconnect prompt loses draft reply when iOS wakes from background.

- **raise**: Persist unsent draft per session before re-establishing the tunnel.

- **proof**: rollout · model_ok · effort_ok · sandbox_ok

Gemini 4 Neon read-only Google

My go-to for prose and design. Clean writing and a fresh perspective when it sits in on review.

**Council prompt:** In council, it starts fresh with no prior chat history and checks for blind spots and clarity.

Illustrative round-1 JSON · Neon 9.0 · APPROVE

- **risk**: Read-only status check shares retry code with mutating game actions.

- **raise**: Keep read queries on a separate path with zero write side effects.

- **proof**: fresh research subagent · strict JSON schema

01 Blind frozen snapshots

Every seat reads the same git archive export and diff. No seat sees another seat, my reasoning, or whether a score target exists.

02 Agreement is not proof

Reviewer precision is low even across three model families. I verify every finding in code or tests before fixing or declining it.

03 Blind Opus tiebreaker

If a seat still disagrees after counter-evidence, a fresh Opus session rules on the claim alone. I wrote the code, so I never rule on my own decline.

## Keep tasks small and separate

Coding agents get messy fast when you give them a vague prompt in a crowded workspace. Results get much better when I figure out the design first, write a short brief with an exact check to run, and put each worker in its own Git worktree.

That same split shows up in the software too. In [omalo](https://btuckerc.dev/projects/s3-amoled#party), asking a question ("Who's in my party?") takes a separate read-only path from asking the AI to change the game ("Win this battle"), and local code handles the button presses.

parallel work without collisions isolated vs. shared checkout

main

clean base

wt/filter-helper

GPT-6.2 Sol (high) · result.patch

wt/tab-shortcuts

Qwen 3.8 27B (nous) · bwrap, no shell

frozen git archive

Full council / Sol xhigh audit · read-only

Director review & test

git apply one patch at a time, run the built app

merge once it passes

Task A: filter helper

writes directly to tree

Task B: tab shortcuts

writes directly to tree

Task C: cleanup

writes directly to tree

One shared checkout

- edits overwrite each other
- git diff mixes all 3 tasks
- build breaks mid-run

Hard to untangle

which task broke the build?

Each task runs in its own directory with its own brief and check, so every patch is small enough to review and test before merging.

**Directors + me:** design decisions, short briefs, applying patches, live testing, and merging.

**Workers:** scoped worktrees (GPT-6.2 Sol for hard jobs, local Qwen 3.8 for small edits) and blind read-only reviews.

## Checking the work is the hard part

I've learned a lot from watching engineers like [Lauren Tan (@poteto)](https://x.com/poteto) put the focus on repeatable checks and hands-on testing instead of piling up diffs.

Before I merge anything, I want to run it the same way a user will. Unit tests catch regressions, while running the built app catches timer wakeups, memory spikes, and signing problems.

checks across my apps real runs vs. unit tests

Looked fine Clean build + unit tests pass, hiding idle timer wakeups.

What the real check verifies

Three 60-second synthetic runs caught idle timer wakeups hurting frame pacing

1080p60 NVENC vs. OBS 32.0.2 + overlays on Windows 11 (67 MB idle, -7.9 ms median A/V sync, GPU-bound 1%/0.1% lows 205/201 vs. 201/185 fps).

Active private RAM (lower is better) winstream

262 MB

OBS 32.0.2

788–931 MB

VRAM footprint (lower is better) winstream

150 MB

OBS 32.0.2

233–259 MB

GPU-bound CPU overhead, 1 core winstream

+13%

OBS + overlays

+37%

Under a 599 Hz cap, 0.1% lows still trail OBS because of Windows Graphics Capture overhead (465–469 fps vs. 563–570 fps).

Looked fine Pages load and block ads while filter compilation spikes browser RAM.

What the real check verifies

Moving filter compilation to a short-lived helper kept Wikipedia RAM below Safari

Running ad-block compilation in a separate helper process that exits after compiling keeps memory out of the main Swift/AppKit/WebKit browser process.

main process angl browser Swift · AppKit · WebKit · stays lean

spawns

short-lived helper ad-block compiler compiles filters · exits & frees RAM

Memory on Wikipedia (lower is better) angl browser

227 MB

Safari

287 MB

Signed and notarized for Apple Silicon Macs on macOS 15 or newer.

Looked fine Agent reports the battle ended and the catch succeeded.

What the real check verifies

Waiting for the game to settle and diffing party + PC memory verifies a catch

Lets Pokémon Emerald settle and diffs party and PC boxes against the pre-battle snapshot, even for a species you already own.

1. Battle ends 2. Wait to settle 3. Diff party + PC RAM

Before battle · Party [4/6] + PC boxes

slot 1 slot 2 slot 3 slot 4 empty empty

PC boxes: existing Pokémon snapshot

After settle · Party [5/6] + PC boxes

slot 1 slot 2 slot 3 slot 4 +catch empty

+ New catch: shows up once (even duplicate species)

Illustrative state diff (not a recorded catch).

- [read the omalo catch check](https://btuckerc.dev/projects/s3-amoled#catch-check)

Looked fine Local preview renders chat layout without a live SSH or Tailscale host.

What the real check verifies

Live iPhone / iPad session over plain SSH or Tailscale against herdr

On-device check connects to a Mac or Linux host, lists tracked agents, reads transcripts as chat, answers a live permission prompt, reviews a diff, and checks optional push alerts.

on device iPhone / iPad SSH keys stay in iOS Keychain

SSH / Tailscale

your machine Mac / Linux · herdr Claude Code · Antigravity · Codex

Chat transcripts Permission prompts Patch diffs Optional push alerts

No accounts or analytics; SSH keys stay in the iOS Keychain on the device.

## Build the tools that save time

Most of the gain from coding agents comes from fixing small annoyances in your own setup. Every tool below grew out of something that slowed me down while running parallel sessions across my Mac and Linux GPU box.

four tools wired into the loop each tool serves a stage

Voice in feeds 01 direct

Dictation

Offline Mac voice-to-text with custom technical vocabulary so talking through a brief beats typing.

- [download for mac](https://github.com/btuckerc/dictation/releases/latest)

- [code](https://github.com/btuckerc/dictation)

Quota & local GPU informs 02 worktrees · 03 council

Pace Bar

Menu bar tracker for Codex/Claude quotas beside local token speed and GPU use on nous, so I can skip low pools or send small jobs to local Qwen.

- [download for mac](https://github.com/btuckerc/pace-bar/releases/latest)

- [code](https://github.com/btuckerc/pace-bar)

Coding session (Mac + nous Linux GPU) agent-run · receipts · full council

- 01 Direct
- 02 Worktrees
- 03 Council
- 04 Test build

Away from desk feeds 03 council · 04 test

Herdwick

iPhone and iPad app over SSH or Tailscale for answering prompts, reading diffs, and optional push alerts when a run needs input or finishes.

- [app store](https://apps.apple.com/app/id6815920496)

- [code](https://github.com/btuckerc/herdwick)

Rules & agent-run underpins 01–04

Boilerplate

Shared Mac and Linux dotfiles managed with chezmoi and mise. Ships agent-run, the council skill, and one shared ruleset for Claude Code and Antigravity.

- [browse config](https://github.com/btuckerc/boilerplate)

## Finish the boring parts

It's easy to stop once something works in a quick demo. Most of what makes an app pleasant to use happens in the "What makes it usable" list below.

after the first working build demo trap vs. shipped work

Easy place to stop What makes it usable

- Easy place to stop Works once on my machine in debug mode What makes it usable Signed and notarized Apple Silicon Mac downloads angl browser Pace Bar Dictation StreamApp
- Easy place to stop Needs manual setup steps nobody else will do What makes it usable App Store review, support pages, and plain privacy policies Herdwick Inkjoin
- Easy place to stop Memory spikes or crashes lose what you were doing What makes it usable Crash-recoverable recordings in StreamApp and a short-lived ad-block helper in angl browser StreamApp angl browser
- Easy place to stop Doesn't say what's still broken What makes it usable A section in the README listing what doesn't work yet

If you're working on coding agents or developer tools, I'd like to hear about it.

- [browse all projects](https://btuckerc.dev/projects)

- [omalo technical notes](https://btuckerc.dev/projects/s3-amoled)

- [say hello](https://btuckerc.dev/contact)
