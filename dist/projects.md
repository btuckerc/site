# Projects — Tucker Craig

> Complete reviewed catalog of 29 software, systems, iOS, macOS, Windows, and hardware projects by Tucker Craig.

Canonical: https://btuckerc.dev/projects

## angl browser (2026)

Everything I've ever liked in browsers, bundled into the lightest macOS browser that still has real features: tree tabs, Spaces with separate Containers, per-site controls, and plain config files.

Built in Swift and AppKit on macOS's built-in WebKit engine instead of bundling Electron or another engine. Includes a Rust bridge for Bitwarden, per-site JavaScript and ad-blocker controls, 120 Hz rendering on AC power, and out-of-process filter compilation so memory stays low (227 MB vs. Safari's 287 MB on Wikipedia). Signed and notarized for Apple Silicon Macs on macOS 15 or newer. GPL-3.0.

- **Stack**: Swift, AppKit, WebKit, Rust
- **Highlights**:
  - No URL bar by default, with floating tab switching and commands on Cmd+T and Cmd+K
  - Tree tabs, Spaces with separate Containers, and live-reloaded JSON/CSS config
  - Per-site JavaScript, content blocker, dark mode, and volume controls
  - Bitwarden passkeys and login autofill via a Rust bridge, plus Apple Passwords
- **Links**: [github](https://github.com/btuckerc/angl-browser) · [download](https://github.com/btuckerc/angl-browser/releases/latest)

## winstream (2026)

A lightweight Windows 11 streaming and recording app written in Rust. Uses about a third as much memory as OBS and a lot less CPU.

StreamApp's Windows counterpart, built in Rust on Windows Graphics Capture, Direct3D 11, direct NVIDIA NVENC 13.0 bindings, per-app WASAPI audio with RNNoise noise suppression and -14 LUFS loudness leveling, and its own FLV muxer. Tested against OBS 32.0.2 at 1080p60 NVENC H.264 (6000 kb/s, Ryzen 9 9950X3D, RTX 4090) with overlays and audio: 262 MB private RAM vs. OBS's 788-931 MB, 150 MB VRAM vs. 233-259 MB, +13% single-core CPU overhead under GPU-bound load vs. +37% for OBS with overlays, and stronger 1% and 0.1% lows under GPU-bound and uncapped loads (-7.9 ms median A/V sync). Under a 599 Hz cap, 0.1% lows still trail OBS's DirectX game-capture hook because of Windows capture overhead. Not on GitHub yet.

- **Stack**: Rust, Direct3D 11, WGC, NVENC, WASAPI
- **Highlights**:
  - ~262 MB active RAM (67 MB idle) and 150 MB VRAM vs. OBS's 788-931 MB RAM and 233-259 MB VRAM
  - GPU-bound load: +13% single-core CPU and 205/201 fps (1%/0.1% low) vs. OBS + overlays at +37% CPU and 201/185 fps
  - Uncapped load: 802/748 fps (1%/0.1% low) vs. OBS + overlays at 680/621 fps
  - Per-app audio capture, RNNoise mic cleanup, -14 LUFS loudness leveling, and a separate VOD track
  - TOML scenes with cut/morph/wipe transitions, camera low-light shadow lift and denoise, and Twitch chat/alert overlays

## Inkjoin (2026)

An iPhone puzzle game where you fill in squares to make one connected shape, using the numbers as clues. Every solved puzzle turns into a drawing.

Nine chapters introduce one idea at a time, plus a new puzzle each day and practice at four difficulty levels. Every puzzle has one solution and never asks you to guess. Hints are unlimited with no penalty. Works offline on iPhone (requires iOS 26).

- **Stack**: Swift, SwiftUI, Cloudflare Workers
- **Highlights**:
  - 74 puzzles across nine chapters
  - Daily puzzles that get harder through the week
  - Hints that show where to look, explain a step, and can fill it in
  - Solved puzzles saved as drawings
- **Links**: [app store](https://apps.apple.com/app/id6819489546) · [github](https://github.com/btuckerc/inkjoin)

## Herdwick (2026)

An iPhone and iPad app for checking on and answering coding agents running on your computer over SSH (built for herdr).

Connects to your own machine over SSH, lists every agent herdr is tracking, and renders their transcripts as chat threads, with a live terminal when you need it. Requires iOS 26 and a Mac or Linux host running herdr. Independent project, not affiliated with herdr or Tailscale.

- **Stack**: Swift, SwiftTerm, SSH, TailscaleKit
- **Highlights**:
  - Inbox of agents across hosts, with the ones waiting on you at the top
  - omp, Claude Code, and Codex transcripts shown as chat
  - Native controls for questions and permission prompts
  - Works over plain SSH or Tailscale, with no account or analytics
- **Links**: [app store](https://apps.apple.com/app/id6815920496) · [github](https://github.com/btuckerc/herdwick) · [privacy](https://btuckerc.dev/privacy/herdwick)

## Dictation (2026)

A local voice-to-text app for Mac with custom vocabulary for technical terms, built on Handy.

Built on Handy, with Fast and Accurate speech-recognition presets. Plain dictation runs completely offline once the models download. If you want text cleanup, you can point it at any OpenAI-compatible endpoint. The Apple Silicon download is signed and notarized.

- **Stack**: Rust, Tauri, Parakeet, Whisper
- **Highlights**:
  - Local speech recognition with Fast and Accurate presets
  - Custom vocabulary for the Accurate preset
  - Configurable dictation shortcuts
  - Optional transcript cleanup with a plain-text fallback
- **Links**: [github](https://github.com/btuckerc/dictation) · [download](https://github.com/btuckerc/dictation/releases/latest)

## CenterSeat (2026)

A movie-seat finder that compares seat maps across showtimes to rank the best seats together.

Compares open seats across nearby showtimes and ranks the best seats together so you don't have to click through every auditorium map yourself. Live searches need a configured data provider.

- **Stack**: Go, Node.js, Docker, OpenCinema, Atom
- **Highlights**:
  - Compares seat maps across nearby showtimes
  - Ranks contiguous seats based on where you like to sit
  - Pluggable data provider for live showtime searches
- **Links**: [site](https://movies.angl.gg) · [github](https://github.com/btuckerc/center-seat)

## Flipping Seven Calculator (2025)

An iOS scorekeeper for Flip 7 with round history and undo.

Keeps score for Flip 7 on iPhone and iPad. Tap cards to tally rounds and bonuses, check round history, undo mistakes, and pick up where you left off.

- **Stack**: Swift, SwiftUI, XCTest, iOS
- **Highlights**:
  - Round history and undo
  - Saves games locally on your device
  - Post-game stats
  - iPhone and iPad layouts
- **Links**: [app store](https://apps.apple.com/us/app/flipping-seven-calculator/id6756905042) · [github](https://github.com/btuckerc/flip7calculator) · [privacy](https://btuckerc.dev/privacy/flipping-seven-calculator)

## Jeopardy Study App (2024)

A Jeopardy study app for searching clues, drilling categories, and playing full boards.

Search past Jeopardy clues, drill specific categories, or play through full boards with answer checking and progress tracking.

- **Stack**: Next.js, TypeScript, Tailwind CSS, PostgreSQL, Prisma
- **Highlights**:
  - Clue search and category practice
  - Full-board game mode
  - Answer checking
  - Progress tracking
- **Links**: [github](https://github.com/btuckerc/jeopardy)

## Pace Bar (2026)

A macOS menu bar app for tracking Codex and Claude quotas, local model speed, and OpenRouter credit.

A fork of CodexBar by Peter Steinberger and contributors, built with SwiftUI and AppKit. The Apple Silicon download is signed and notarized for macOS 14 and up (Intel Macs can build from source). Forecasts are rough estimates, and it doesn't switch accounts.

- **Stack**: Swift, SwiftUI, AppKit
- **Highlights**:
  - One quota ring per Codex and Claude subscription
  - Pooled Codex forecast that flags quota about to reset unused
  - Local inference token counts and speed, with optional GPU readings
  - OpenRouter balance kept separate from estimated API cost
- **Links**: [github](https://github.com/btuckerc/pace-bar) · [download](https://github.com/btuckerc/pace-bar/releases/latest)

## StreamApp (2026)

Record your screen or stream to Twitch from your Mac's menu bar.

A Mac menu bar app for capturing your screen or windows, tweaking webcam and audio, streaming to Twitch, using a notch teleprompter, and drawing right on the desktop. Signed and notarized for Apple Silicon Macs on macOS 26 or newer (or build from source without a signing cert). Licensed under GPL-3.0.

- **Stack**: Swift, FFmpeg, WebRTC
- **Highlights**:
  - Crash-recoverable screen and window recording
  - Desktop and Full Camera layouts with webcam punch-in
  - Twitch streaming with a confirmation step before going live
  - Desktop drawing and live loudness meters
- **Links**: [github](https://github.com/btuckerc/streamapp) · [download](https://github.com/btuckerc/streamapp/releases/latest)

## Tablet Companion (2026)

Set up a Wacom tablet and its drawing shortcuts on your Mac.

A small setup helper for the Wacom Intuos BT S (tested with driver 6.4.14-1). It walks through the Wacom driver install and maps tablet buttons to StreamApp drawing shortcuts without touching your other buttons. Only supports the Intuos BT S for now. Signed and notarized for Apple Silicon Macs on macOS 26 or newer.

- **Stack**: Swift, Wacom Driver
- **Highlights**:
  - Guided Wacom driver download and installer handoff
  - Suggested button layout for StreamApp drawing
  - Restore previous button mappings anytime
  - Local backups of your tablet settings
- **Links**: [github](https://github.com/btuckerc/tablet-companion) · [download](https://github.com/btuckerc/tablet-companion/releases/latest)

## Boilerplate (2019)

My macOS and Linux workspace setup, managed with chezmoi and mise.

My shared dotfiles and workspace config for macOS and Linux, managed with chezmoi and mise. Includes bootstrap and recovery notes for bringing up a new machine.

- **Stack**: Bash/Zsh, Chezmoi, Mise, Lua, Tmux
- **Highlights**:
  - Shared macOS and Linux configuration
  - Tool version management with mise
  - Machine-aware templates
  - Bootstrap and recovery notes
- **Links**: [github](https://github.com/btuckerc/boilerplate)

## OpenCode Monitor (2026)

A small macOS menu bar app for keeping an OpenCode server under control.

Puts OpenCode server status, start and stop controls, logs, updates, and optional idle shutdown right in your macOS menu bar.

- **Stack**: Swift, macOS, LaunchAgent, Shell
- **Highlights**:
  - Menu bar status and quick controls
  - Start, stop, and restart actions
  - Optional idle auto-stop
  - Build and uninstall scripts
- **Links**: [github](https://github.com/btuckerc/opencode-menu)

## btuckerc.dev (2025)

This website. A terminal-style portfolio with keyboard navigation, a command palette, and fuzzy project search.

Built with React and Vite and styled like a terminal. All the project data lives in one JSON file, and every route prerenders to static HTML at build time.

- **Stack**: React, Vite, Tailwind CSS, Framer Motion, Fuse.js
- **Highlights**:
  - Command palette on the colon key
  - Fuzzy project search that forgives typos
  - Keyboard navigation across lists
  - Theme and font switching
- **Links**: [site](https://btuckerc.dev) · [github](https://github.com/btuckerc/site)

## AudioReader (2025)

A local audiobook player with synced captions generated with Whisper.

Plays local audiobooks in the browser alongside synced VTT captions generated locally with Whisper.

- **Stack**: Python, Flask, Whisper, FFmpeg, HTML5 Audio
- **Highlights**:
  - Synced VTT captions
  - HTML5 audio playback
  - Playlist support
  - Local Whisper transcription
- **Links**: [github](https://github.com/btuckerc/audioreader)

## Farkle Scorer (2025)

An offline iOS scorekeeper for Farkle with tap-to-score dice and some nearby multiplayer experiments.

Tap the dice you rolled or enter scores manually if you're using physical dice. Supports custom house rules and an experimental nearby multiplayer mode.

- **Stack**: Swift, SwiftUI, XCTest, Multipeer Connectivity
- **Highlights**:
  - Tap-to-score dice
  - Manual score entry for physical dice
  - Configurable house rules
  - Works completely offline
- **Links**: [app store](https://apps.apple.com/us/app/farkle-scorer/id6756927115) · [github](https://github.com/btuckerc/farkle)

## Spotify DJ (2019)

An older experiment that orders Spotify playlists by BPM, key, and danceability.

Pulls audio features from Spotify and suggests a track order based on BPM, key, danceability, and energy. It's an older project, so check the repo setup notes before running it.

- **Stack**: Python, Spotipy, Spotify Web API, OAuth2
- **Highlights**:
  - Audio feature analysis
  - Song-ordering algorithm
  - Playlist and track-library support
  - Configurable weighting
- **Links**: [github](https://github.com/btuckerc/spotify-dj)

## Physical Computing Final (2018)

A college physical computing project: a plastic garden owl rigged with a Pi camera, mic, and light sensor.

Built for DIG333 at Davidson. A fake garden owl watches a walkway with a Raspberry Pi camera, microphone, and light sensor to count foot traffic, track noise levels, spot average shirt colors, and tweet updates about how busy it is.

- **Stack**: Python, OpenCV, NumPy, Sensors
- **Highlights**:
  - Pi camera with OpenCV people counting
  - Microphone for walkway noise levels
  - Light sensor to put the owl to sleep at night
  - Automated status tweets from the owl
- **Links**: [github](https://github.com/btuckerc/phys-comp-final)

## ComicScanner (2024)

My first take on a comic cataloging tool, using barcode scanning and image matching.

An earlier Flask app for cataloging comics with barcode scanning, cover matching, metadata lookup, and collection import and export.

- **Stack**: Python, Flask, JavaScript, Computer Vision APIs
- **Highlights**:
  - Barcode scanning
  - Cover image matching
  - Metadata lookup
  - Collection import and export
- **Links**: [github](https://github.com/btuckerc/ComicScanner)

## RSS News Summarizer (2024)

A small web app experiment that pulls RSS feeds and writes short summaries.

Parses RSS feeds from multiple sources and generates short markdown summaries in a simple web UI.

- **Stack**: Python, RSS Parser, HTML/CSS
- **Highlights**:
  - RSS feed parsing
  - Multi-source aggregation
  - Automatic summaries
  - Markdown output
- **Links**: [github](https://github.com/btuckerc/rss-summarizer)

## Spotify Preference Analyst (2019)

An older Python project that uses Spotify audio features and Euclidean distance to map out music taste.

Uses linear algebra (Euclidean distance on Spotify's audio features) to analyze listening history, chart genres, and experiment with track recommendations.

- **Stack**: Python, Spotipy, NumPy, Spotify Web API
- **Highlights**:
  - Listening history analysis
  - Preference mapping with Euclidean distance
  - Genre charts
  - Recommendation experiments
- **Links**: [github](https://github.com/btuckerc/spotify-analyst)

## earcandy (2026)

Drop in a finished electronic track to pull out each distinct sound as its own stem, plus a matching Serum 2 patch.

A local macOS tool that splits a song into sound families (plucks, basses, leads, chops, risers, drum hits), exports each one as a stem, and searches Serum 2's factory presets for a matching patch. Separation runs locally on Apple silicon.

- **Stack**: Python, Audio source separation, Serum 2 (VST3)
- **Highlights**:
  - One stem and one .SerumPreset per sound
  - A/B playback of the mix, the isolated sound, and the Serum patch
  - Timeline showing every spot each sound appears
  - Refine, hide, and merge sound families

## Music (2026)

I make music too. My tracks are on SoundCloud.

Original tracks and experiments, published on SoundCloud as tux.
- **Links**: [soundcloud](https://soundcloud.com/tuxix)

## OMP Serve (2026)

A small browser workspace for coding-agent sessions running on my own server.

A single-user web client for OMP agent sessions running on my own server. The agent, files, and shell commands stay on the server, and the browser just connects over a private network with no extra middleware or copies of the conversation.

- **Stack**: TypeScript, Bun
- **Highlights**:
  - Pick a project and model, then start or resume a conversation
  - Scratch conversations outside any project
  - Git changes view for workspaces

## Tempo (2026)

An offline iPhone app for tracking food, workouts, and sleep, without streaks or scores.

An iPhone app built around four tabs: Today, Eat, Move, and Sleep. No streaks, daily grades, or confetti. Optional AI planning goes through a server broker so no API keys ship in the app.

- **Stack**: Swift, SwiftUI, WidgetKit, HealthKit
- **Highlights**:
  - Barcode, nutrition label, and menu scanning for fast meal logging
  - Bodyweight, walking, and gym workouts with plain-English form cues
  - Workout Live Activity and Home Screen widgets
  - Apple Health import for sleep and body measurements

## angl-dj (2026)

A self-hosted DJ tool for managing my music library, planning sets, and syncing with Rekordbox.

Still early. Built with a FastAPI backend, background worker, React frontend, PostgreSQL, Redis, and Qdrant vector search. So far it has sign-in, a library dashboard, and health checks.

- **Stack**: Python, FastAPI, React, PostgreSQL, Qdrant
- **Highlights**:
  - Library dashboard for audio files, recordings, analyzed tracks, and crates
  - Health checks for the database, queue, and vector search

## py-trading (2025)

An experimental Python ML trading project with return forecasting, risk limits, and paper trading.

Forecasts returns across multiple time horizons and turns them into portfolio weights, using point-in-time market data in DuckDB and Parquet so backtests don't cheat with future data. Strictly an experiment, not investment advice.

- **Stack**: Python, DuckDB, XGBoost, LightGBM
- **Highlights**:
  - Point-in-time, as-of data queries
  - Risk limits with sector tilts and a drawdown throttle
  - Daily paper-trading loop with a dry-run mode
- **Links**: [github](https://github.com/btuckerc/py-trading)

## ANGL Comic Scanner (2025)

Point an iPhone at a comic cover to identify the series and issue, on-device and offline.

The follow-up to my earlier comic scanner. A Python script packs a CLZ Comics export into a compressed bundle of cover thumbnails and image features, and the iOS app matches live camera frames on-device using Apple Vision first and OpenCV to double-check.

- **Stack**: Swift, SwiftUI, OpenCV, Python
- **Highlights**:
  - Runs completely on the phone with no network needed
  - Apple Vision search plus A-KAZE and RANSAC verification
  - Collection bundles built from a CLZ Comics export

## JustBobThoughts (2019)

A Twitter bot that posted clips of the quiet, ambient moments from Bob Ross's painting shows.

A weekend Python bot built on Tweepy that uploaded short clips of the ambient sections of Bob Ross's episodes to Twitter.

- **Stack**: Python, Tweepy
- **Links**: [github](https://github.com/btuckerc/JustBobThoughts)
