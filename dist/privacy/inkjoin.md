# Privacy Policy - Inkjoin

> Privacy policy for Inkjoin, an iPhone logic puzzle game by Tucker Craig.

Canonical: https://btuckerc.dev/privacy/inkjoin

## Your puzzles stay yours.

Inkjoin is an iPhone logic puzzle game. Your progress stays on your device, and the optional anonymous analytics just help me tune puzzle difficulty.

- **data linked to you**: none

- **account**: not required

- **analytics**: optional to send

- **ads & tracking**: none

developer Tucker Craig

## Data collected

Inkjoin has no third-party SDKs, ads, tracking, or crash-reporting tools. Anonymous analytics are on by default and can be turned off anytime in Settings → "Send anonymous analytics".

The first time you solve each daily puzzle, Inkjoin sends the puzzle date, how long it took in whole seconds, and whether you used hints. Along with that report, the server records the UTC receipt time, app build number, coarse country code, and local hour (0–23) derived ephemerally at the Cloudflare edge. Your IP address is never logged or stored, and there's no account or device identifier, so none of it is tied to you. I use it to tune puzzle difficulty and understand how the daily board is played, and it's stored in a Cloudflare D1 database.

Opening a public share link on inkjoin.btuckerc.dev also increments aggregate daily counters (link-preview fetches by route, and browser visits by route and coarse country) without storing shared puzzle tokens, URLs, or IP addresses.

## Daily puzzles

Daily puzzles download from my server at inkjoin.btuckerc.dev, hosted on Cloudflare. Once a puzzle downloads, it works offline. Fetching daily puzzles sends standard HTTP info (including your IP address) to Cloudflare, and I don't log or store anything from puzzle download requests.

## Data stored on your device

Your progress, marks, and settings stay on your device in the app's Documents folder. Deleting Inkjoin wipes them. You can also reset your progress anytime in Settings.

## Purchases

Optional in-app purchases (such as Inkjoin Full) are bought through Apple. Apple handles the payment, and I never receive any payment or personal details. The app just checks with the App Store to see which purchases are active on your device.

## Permissions

Inkjoin doesn't ask for any permissions, including photos, notifications, or location.

## Tracking

Inkjoin does not track you and does not use Apple's App Tracking Transparency framework.

## Children's privacy

Inkjoin collects no personal information from children.

## Contact

For privacy questions, email [btuckerc.dev@gmail.com](mailto:btuckerc.dev@gmail.com).
