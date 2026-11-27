# Support - Herdwick

> Help and setup guide for Herdwick, the iPhone and iPad app by Tucker Craig for reading and answering coding agents on your own machines.

Canonical: https://btuckerc.dev/herdwick/support

## Coding agents on your phone.

Herdwick shows the coding agents on your own machines as conversations. Read what they did and answer them from your iPhone or iPad.

## What you need

- An iPhone or iPad on iOS 26 or later.
- A Mac or Linux machine running [herdr](https://herdr.dev), with your coding agents (omp, Claude Code, Codex) in its panes.
- SSH access to that machine, directly or through Tailscale.

## Connect a machine

- Open Herdwick and add a host by its address, or sign in to Tailscale and pick a machine.
- Sign in with a password, or with the key Herdwick makes on your device: copy it from Settings into `~/.ssh/authorized_keys` on the machine.
- Your agents appear in the inbox. Nothing is installed on the machine.

## If it won't connect

- Check that you can SSH to the machine from another device with the same user.
- Check that herdr is running on it. Herdwick shows only agents herdr tracks.
- For key sign-in, check that the whole key line is in `authorized_keys`.

## Try it without a machine

On the first screen, tap "Explore a demo host". You can exit demo mode anytime from the Hosts screen.

## Contact

Email [btuckerc.dev@gmail.com](mailto:btuckerc.dev@gmail.com). Read the [privacy policy](https://btuckerc.dev/privacy/herdwick).

Independent project. Not affiliated with or endorsed by the herdr project or Tailscale Inc.
