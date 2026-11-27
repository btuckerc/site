# omalo: Pocket Companion Running ichr — Tucker Craig

> omalo is a pocket ESP32-S3 hardware companion by Tucker Craig running ichr. Play Pokémon Emerald yourself, or hand off goals to an AI.

Canonical: https://btuckerc.dev/projects/omalo

## omalo

a pocket companion running ichr

I'm writing the firmware for it. You can play Pokémon Emerald yourself, or hand off a goal to the AI and let it take a turn.

Prototype

- [technical notes](https://btuckerc.dev/projects/s3-amoled)

![A hand holds a small rounded device running Pokémon Emerald. The screen shows a queued 'Beat the game' goal and asks the player to continue, then say go.](https://btuckerc.dev/media/s3-amoled/device-in-hand-public.jpg)

Early prototype with a goal queued up.

omalo a pocket companion

ichr the life inside

omalo / ichr

## Pokémon Emerald on omalo

Here I picked Mudkip, then asked Luna to beat the Zigzagoon. The local battle controller takes over from there, and you can jump back in with the buttons at any time.

Voice transcription and model calls go out over Wi-Fi.

- [how the handoff works](https://btuckerc.dev/projects/s3-amoled#handoff)

Defeat the Zigzagoon

Desktop UI replay of a real Luna request and battle (actual model wait time left in). [download GIF](https://btuckerc.dev/media/s3-amoled/pokemon-agent-battle.gif)

about this capture

The battle and Luna's response are real, replayed on a computer using the device's actual UI. It's not a camera recording of the hardware or a live mic recording.

## A tiny game you play by moving it

Tilt omalo to roll a tiny fleck around a rounded play area. This clip compares how it feels with wall bounce off vs. on.

- [read the Grain notes](https://btuckerc.dev/projects/s3-amoled#grain)

Grain

Bounce off, then on (with simulated taps and tilt). [download GIF](https://btuckerc.dev/media/s3-amoled/grain-bounce-off-on-catch-v4.gif)

about this capture

This demo runs the device's real settings screen and game code on a computer. Each run starts from the same spot with the same simulated tilt, first with bounce off and then on. The bubble pop and score change come straight from the game.

## Built to be extended

ichr is the software inside omalo. I'm building it with open source in mind, so people can modify it, extend it, and adapt it to their own hardware.

- [![App launcher showing chat, profile, list, and remind.](https://btuckerc.dev/media/s3-amoled/app-launcher.png)](https://btuckerc.dev/media/s3-amoled/app-launcher.png)

Launcher

- [![Grain settings for bounce, surface, tilt, and calibration.](https://btuckerc.dev/media/s3-amoled/app-grain-controls.png)](https://btuckerc.dev/media/s3-amoled/app-grain-controls.png)

Grain controls

- [![A sample list item, milk, with remove and cancel controls.](https://btuckerc.dev/media/s3-amoled/app-list.png)](https://btuckerc.dev/media/s3-amoled/app-list.png)

Lists

- [![A sample chat reply demonstrating text layout on the small screen.](https://btuckerc.dev/media/s3-amoled/app-chat.png)](https://btuckerc.dev/media/s3-amoled/app-chat.png)

Chat

Firmware screens rendered on a computer with sample data. Click any screen to see it full size.

## How omalo got its name

I first wanted to call it talos, but that name was taken. Then came talo. I love oma projects like [Omarchy](https://omarchy.org/), so oma + talo became omalo.

### ichor → ichr

`ichr` is short for *ichor*. In the Greek myth of Talos, ichor is the life fluid running through a bronze body. I liked that as a metaphor for a soul: ichr is the software inside omalo that brings it to life. [More on ichor](https://www.greekmythology.com/Myths/Elements/Ichor/ichor.html).

first idea talo s → talo

the influence
- [Omarchy](https://omarchy.org/)
→ oma

oma talo

oma lo

## How it works

The technical notes walk through how the AI handoff works, how it checks whether a catch actually happened, and how Grain keeps the fleck out of hidden rounded corners.

- [open s3-amoled](https://btuckerc.dev/projects/s3-amoled)
