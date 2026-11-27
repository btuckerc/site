# Privacy Policy - Herdwick

> Privacy policy for Herdwick, an iOS coding-agent client by Tucker Craig that connects directly over SSH to your own machines.

Canonical: https://btuckerc.dev/privacy/herdwick

## Your agents stay on your machines.

Herdwick is an iPhone and iPad app for coding agents running on your own computers. It connects straight to them over SSH, and I don't collect or store any of your data.

- **data collected**: none

- **accounts**: not required

- **analytics & ads**: none

- **connections**: direct over SSH

effective September 26, 2026 developer Tucker Craig

## Data collected

**None.** Herdwick has no analytics, ads, or crash-reporting SDKs. I don't store anything about you. The only service I run is the optional push relay described below, which forwards alerts without storing or logging them.

## Your machines and connections

Herdwick connects over SSH to the computers you add. The conversations, terminal output, messages, and attachments you view and send travel straight between your device and that computer, encrypted by SSH. Nothing is copied anywhere else.

- Host names, addresses, and usernames stay on your device.
- Your device generates its own SSH key, and the private key never leaves it. The key, any saved passwords, and trusted host keys live in the iOS Keychain for this device only and aren't included in backups.
- Removing a host in Herdwick deletes its saved password and host key.
- Images you attach upload only to your computer's temporary folder. Herdwick cleans them up after the window you pick in Settings.

## Tailscale (optional)

If you sign in to Tailscale, Herdwick runs Tailscale's client inside the app so it can reach your machines on your tailnet. Sign-in happens on Tailscale's web page in a Safari view, so Herdwick never sees your credentials.

While Tailscale is on, Tailscale Inc. receives what its client needs to connect and troubleshoot this device:

- Device identity keys and a device name (`herdwick-<random>`)
- Operating system version, device model, and network addresses
- Diagnostic logs from the Tailscale client

That data is tied to your Tailscale account and covered by [Tailscale's privacy policy](https://tailscale.com/privacy-policy). It isn't used for tracking or ads, and I never receive it. Signing out in Settings wipes this device's tailnet identity from the app. If you never sign in, none of this runs.

## Alerts while away (optional)

If you turn on Alerts While Away, Herdwick starts a tiny watcher over SSH on each connected computer when you leave the app. It stops when you come back, exits on its own after a day, and doesn't install anything permanent.

When an agent needs you or finishes, your computer sends Herdwick's push relay:

- This device's Apple push notification token
- Identifiers for the computer (a random ID Herdwick made), the herdr session, and the pane
- The agent's new state and a change number

It never sends names, paths, or anything an agent wrote. The relay (which I run on Cloudflare Workers) passes that along to Apple's push service and keeps nothing: no storage and no request logs. The alert text is generic, and your device fills in the names it already knows. You can turn this off in Settings anytime, and the relay's [source code](https://github.com/btuckerc/herdwick/blob/main/relay/src/index.js) is public.

## Data stored on your device

Herdwick keeps a few things locally on your device so it works:

- Your host list and connection settings
- Preferences like appearance, terminal theme, font, and notification choices
- Which agents you've read, so the inbox knows what's new

Deleting the app removes this data, aside from any device backup you manage yourself.

## Permissions

- **Notifications**: off until you turn them on. Alerts happen on your device while Herdwick is open or refreshing in the background, or come through Apple's push service if you enable Alerts While Away.
- **Photos**: Herdwick uses the system photo picker and only sees the images you pick.
- **Network**: used only to reach the machines you add, plus Tailscale and Apple's push service if you turn those on.

## Tracking

Herdwick does not track you across apps or websites and does not use Apple's App Tracking Transparency framework.

## Children's privacy

Herdwick does not collect personal information, so there is no user data to sell, profile, or share for children or adults.

## Changes to this policy

If this policy changes, I'll update the effective date above and post the new version right here.

## Contact

For privacy questions, email [btuckerc.dev@gmail.com](mailto:btuckerc.dev@gmail.com).

Independent project. Not affiliated with or endorsed by the herdr project or Tailscale Inc.
