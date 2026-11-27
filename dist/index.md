# Tucker Craig — Projects, Apps & AI Workflow (btuckerc.dev)

> Software engineering portfolio of Tucker Craig: angl browser, winstream, Herdwick, Pace Bar, Dictation, Inkjoin, omalo, and how he builds with coding agents.

Canonical: https://btuckerc.dev/

Software Engineer

## TUCKER CRAIG

If something I use every day bugs me, I've started putting my free time into fixing it.

Lately that's meant a Mac browser, a Windows streaming app, and an iPhone app for my coding agents. I like Omarchy's idea that [we can fix everything](https://wecanfixeverything.com). Everything is solvable. All it takes right now is someone pointing their tokens in the right place. The tools below are all things I use myself.

I also sang a cappella in [The Nuances](https://open.spotify.com/track/5CV2w2PIbKouRr2jNKjJIR) at Davidson.

- [more about me](https://btuckerc.dev/about)

how i build

## How I use coding agents

Instead of asking one chat window to do everything, I split the work across models. Gemini 4 Neon or Claude Opus 5.5 directs, GPT-6.2 Sol and a local Qwen 3.8 GPU worker write patches in isolated copies of the repo, and on big changes five models from three families review the same frozen snapshot blind before I run the built app myself.

current model stack 3 cloud families + 1 local GPU · click a plane

Google (Neon) Anthropic (Opus, Fable) OpenAI (Sol, Astra, Luna) Local GPU (Qwen 3.8)

Two peer directors own the plan and the final build

One model sits with me as the lead. We decide how a feature should work, split it into small briefs, review every patch, and run the built app.

- Gemini 4 Neon high Antigravity (agy) Primary director for daily work, prose, design, and verification.
- Claude Opus 5.5 high Claude Code Peer director for coordinating multi-step work and overall product quality.

Director rule verified

- **owns**: Requirements, briefs, patch apply, real app check

- **guard**: PreToolUse hook blocks nested or detached launches

Isolated workers write patches in clean copies of the repo

Each coding job runs in its own copy of the codebase so parallel work never collides. Hard tasks go to the cloud; small edits run on my home GPU.

- GPT-6.2 Sol high agent-run sol · worktree Detail-oriented worker for hard changes in an isolated Git worktree. Returns result.patch.
- Qwen 3.8 27B local GPU nous · Radeon R9700 · bwrap Bounded edits on my Linux box (vLLM + DFlash2). Read/edit only; I run checks.
- GPT-6 Luna low agent-run ask --model luna Fast, cheap extraction and bounded summaries.

Transcript receipt (~/.local/state/agent-runs) verified

- **check**: model_ok: true · effort_ok: true · sandbox_ok: true

- **note**: Local bwrap is runner-attested; cloud checks rollout/API log

Five blind reviewers plus a strict release auditor

Before big changes ship, five models from three companies inspect the exact same frozen snapshot without seeing each other. High-stakes commits also get a pass/fail audit.

- Full Council 5 seats · 3 families Sol · Opus · Fable · Astra · Neon Read-only JSON review of a frozen git archive snapshot. Loops until done or plateau.
- GPT-6.2 Sol xhigh · audit agent-run audit · read-only Strict PASS / BLOCK / UNVERIFIED gate on one exact commit. Stops at counterexamples.

Merge gate verified

- **blind**: Frozen git archive · no other seats, no score targets

- **ship**: Real build run like a user clears merge, not test green alone

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

- [read the full workflow](https://btuckerc.dev/workflow)

- [omalo agent notes](https://btuckerc.dev/projects/s3-amoled)

angl browser

## The lightest macOS browser that still has features

macOS · WebKit

Everything I've ever liked in browsers, bundled into the lightest macOS browser that still has real features: tree tabs, Spaces with separate Containers, per-site controls, and plain config files.

angl browser memory footprint (227 MB vs Safari 287 MB and Search.app 427 MB on Wikipedia), shared WebKit and ephemeral filter-compiler architecture, no-URL-bar tree-tab window layout, and built-in zero-extension capabilities.

memory on wikipedia app + WebKit processes

angl browser 227 MB ( −21% vs Safari )

Safari 287 MB

Search.app 427 MB

- **bundled engines**: 0

- **ProMotion on AC**: 120 Hz

- **signed & notarized**: macOS 15+

why it stays light no Electron · no bundled engine

persistent browser few MB shell

Swift 6 / AppKit shell

System WKWebView (shared w/ macOS) In-process Rust Bitwarden SDK

spawns angl --lists on list updates

short-lived child process exits & frees RAM

AdGuard rule compiler

Compiles filter lists into WebKit content rules out of process so compile spikes never stay in browser memory.

distinct layout no URL bar by default

1 2 isolated cookies & proxy

- WebKit
- Content Rules
- WKWebView
- Release notes

full-height page · no URL bar ⌘K palette / ⌘T tabs

- > dark force site
- > js off site
- > container work space

built in · zero extensions live-reloaded config

~/.config/angl/ theme.json settings.json keys.json \<host\>.css

- **Passwords**: Bitwarden Rust SDK + Touch ID passkeys & Apple Passwords

- **Blocker**: AdGuard WebKit content rules + scriptlets

- **Per-site**: JS, dark mode, volume, noJIT & Lockdown (⇧⌘I)

- **Media**: Night audio compressor, instant fullscreen & YouTube stills

- [download for mac](https://github.com/btuckerc/angl-browser/releases/latest)

- [code](https://github.com/btuckerc/angl-browser)

winstream · rust · windows

## A lighter Windows streaming app

Local build

A lightweight Windows 11 streaming and recording app written in Rust. Uses about a third as much memory as OBS and a lot less CPU. Built directly on Windows Graphics Capture, Direct3D 11, and NVIDIA NVENC, with per-app audio, noise suppression, auto-leveling, and its own FLV muxer.

| Metric (1080p60 NVENC + overlays) | winstream | OBS 32.0.2 |
| --- | --- | --- |
| Private RAM (active / idle) | 262 MB / 67 MB | 788-931 MB |
| VRAM footprint | 150 MB | 233-259 MB |
| GPU-bound CPU overhead (1 core) | +13% | +37% (+25% no overlays) |
| GPU-bound 1% / 0.1% low FPS | 205 / 201 fps | 201 / 185 fps |
| Uncapped 1% / 0.1% low FPS | 802 / 748 fps | 680 / 621 fps |

Tested on Windows 11 (Ryzen 9 9950X3D, RTX 4090) at 6000 kb/s H.264 across three 60-second synthetic game runs with camera, chat overlay, and audio. Average FPS stays within 1% of OBS across every load, and A/V sync measured -7.9 ms median (within one 60 fps frame, zero discontinuities). Under a 599 Hz cap, 0.1% lows still trail OBS's DirectX game-capture hook because of Windows capture overhead (465-469 fps after idle-wakeup fixes vs. OBS's 563-570 fps). Not on GitHub yet.

herdwick

## Coding agents on your phone

An iPhone and iPad app for checking on and answering coding agents running on your computer over SSH (built for herdr).

![Seven Herdwick iPhone screenshots: the agent inbox, answering an agent, reading what it did, reviewing diffs, what's new since last time, connecting machines over SSH or Tailscale, and the live terminal.](https://btuckerc.dev/media/herdwick/screenshots-iphone.webp)

- [![Download Herdwick on the App Store](https://btuckerc.dev/media/app-store-badge.svg)](https://apps.apple.com/app/id6815920496)

- [code](https://github.com/btuckerc/herdwick)

dictation

## Local voice-to-text

A local voice-to-text app for Mac with custom vocabulary for technical terms, built on Handy.

Dictation overlay

Dynamic Orb overlay: light ripples as you speak and swirls while transcribing.

- [download for mac](https://github.com/btuckerc/dictation/releases/latest)

- [code](https://github.com/btuckerc/dictation)

pace-bar

## AI quotas and local inference

A macOS menu bar app for tracking Codex and Claude quotas, local model speed, and OpenRouter credit.

![Pace Bar menu bar popover showing sample Codex and Claude quota rings, local llama-server token throughput and GPU usage, and OpenRouter credit balance.](https://btuckerc.dev/media/pace-bar/pace-bar.png)

- [download for mac](https://github.com/btuckerc/pace-bar/releases/latest)

- [code](https://github.com/btuckerc/pace-bar)

omalo · prototype

## Pokémon Emerald on Arduino

Firmware for a small ESP32-S3 handheld that runs Pokémon Emerald, with an AI you can hand goals off to.

![A hand holds a small rounded device running Pokémon Emerald. The screen shows a queued 'Beat the game' goal and asks the player to continue, then say go.](https://btuckerc.dev/media/s3-amoled/device-in-hand-public.jpg)

- [explore omalo](https://btuckerc.dev/projects/omalo)

- [technical notes](https://btuckerc.dev/projects/s3-amoled)

inkjoin

## Logic puzzles!

An iPhone puzzle game where you fill in squares to make one connected shape, using the numbers as clues. Every solved puzzle turns into a drawing.

Solving a puzzle

Solving with a hint

Dark mode

![Seven Inkjoin iPhone screenshots: a partly filled puzzle, the home screen with today's puzzle, the chapter list, drawings from one chapter, the Drawings collection, practice difficulty levels, and a puzzle in dark mode.](https://btuckerc.dev/media/inkjoin/screenshots-iphone.webp)

- [![Download Inkjoin on the App Store](https://btuckerc.dev/media/app-store-badge.svg)](https://apps.apple.com/app/id6819489546)

- [code](https://github.com/btuckerc/inkjoin)

center-seat

## Movie-seat ranking

Small personal tool to find the best seat for a movie every time.

- [demo](https://movies.angl.gg)

- [code and setup](https://github.com/btuckerc/center-seat)

boilerplate

## My opinionated config setup

My macOS and Linux workspace setup, managed with chezmoi and mise.

- [browse config](https://github.com/btuckerc/boilerplate)

- [more projects](https://btuckerc.dev/projects)
