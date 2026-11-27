# What happens when you hand Pokémon to an AI? — Tucker Craig

> Technical notes inside omalo by Tucker Craig: a Pokémon Emerald battle handoff, verifying what an agent actually did, Route 102 navigation, and Grain corner physics.

Canonical: https://btuckerc.dev/projects/s3-amoled

## What happens when you hand Pokémon to an AI?

Back in 2017, I wrote a college post about OpenAI's bot learning to play Dota. Now I'm building a pocket companion that lets me play Pokémon Emerald and hand off goals to an AI. It's a totally different setup, but it keeps pulling me back to the same question: how does a computer turn what it knows about a game into actions it can actually pull off?

- [read my 2017 post on AI and Dota](https://tuckercraig.com/DIG101/the-future-of-ai-is-openai/)

Prototype · Waveshare ESP32-S3 touch AMOLED

## I asked it to win a battle

I picked Mudkip, then asked Luna to beat the Zigzagoon. From there, the local battle controller took over. The replay below shows the whole loop, from my request through the fight to the result.

You can also play normally and grab control back with the device buttons whenever you want. The handoff lives right inside the game instead of in some separate demo you can only watch.

- 1. My request
- 2. The battle
- 3. The result

Defeat the Zigzagoon

Desktop UI replay of a real Luna request and battle (actual model wait time left in). [download GIF](https://btuckerc.dev/media/s3-amoled/pokemon-agent-battle.gif)

about this capture

The battle and Luna's response are real, replayed on a computer using the device's actual UI. It's not a camera recording of the hardware or a live mic recording.

## What does the AI actually control?

Here's how that request splits up. Pokémon Emerald runs directly on the handheld, while speech transcription and model calls go out over Wi-Fi. The AI gets a structured summary of what's happening in the game, and local code on the device handles the actual movement and battle buttons.

The model isn't running locally on the chip, and asking it for a goal doesn't guarantee it will finish every time.

### On the device

Pokémon Emerald Game state and local controllers

### Over Wi-Fi

Speech transcription Model calls

Game state → agent Supported actions → local controllers → game

Game state goes out over Wi-Fi. Local controllers handle the actual inputs.

## Getting there is part of the goal

Walking from one town to the next sounds easy until there's a trainer looking right at the path and tall grass in the way.

I can ask for fewer steps, less tall grass, or a route that dodges trainers, and those don't always line up. The pathfinder can cut down on grass tiles first and break ties by distance, or skip trainer sightlines altogether.

Try switching the task below. The map is Route 102 from Pokémon Emerald. The overlay just shows how those tradeoffs change the route, not a live recording of Luna playing.

Interactive Route 102 map loads as you scroll here.

## Did it actually catch anything?

Before the controller reports a catch, it has to show up in the actual game state. Once the game settles, it diffs your party and PC storage boxes against how they looked before, looking for one new Pokémon that wasn't there earlier.

Just checking the species name wouldn't cut it. If you already had a Zigzagoon sitting in storage, seeing a Zigzagoon afterward wouldn't prove this attempt was the one that caught it.

### Before

Party + PC boxes

Existing Pokémon

New target: not there yet

### After the game settles

Party + PC boxes

Existing Pokémon

+ New target: shows up once

Example state diff, not a recording of an actual catch.

## Sometimes I just want to ask a question

Asking 'Who's in my party?' is a different kind of request from 'Win this battle.' To answer a question, the app just reads the current party state without sending any movement or battle inputs.

Keeping read-only questions separate from actions that change the game keeps things predictable.

### "Who's in my party?"

Reads the current game state.

No movement or battle inputs.

### "Win this battle."

Hands off to the local controllers.

Actually changes the game.

## The other game starts when you move it

Grain is a tiny motion game on the same handheld. You tilt the device to steer a little fleck around a rounded play area. Because the fleck is only seven pixels wide, tiny tweaks to how it moves make a big difference in how it feels.

The motion simulation ticks at 240 Hz under the hood. That's the internal physics rate, separate from how fast the screen refreshes.

Grain

Bounce off, then on (with simulated taps and tilt). [download GIF](https://btuckerc.dev/media/s3-amoled/grain-bounce-off-on-catch-v4.gif)

about this capture

This demo runs the device's real settings screen and game code on a computer. Each run starts from the same spot with the same simulated tilt, first with bounce off and then on. The bubble pop and score change come straight from the game.

Look closer at the play area

Zoomed-in still from the same desktop capture. Scroll around to inspect the pixels.

![Enlarged Grain capture, including the play area and its controls.](https://btuckerc.dev/media/s3-amoled/grain-bounce-off-on-catch-v4-poster.png)

## Where does it go when it hits a corner?

The screen has rounded corners, but the image buffer underneath is still a rectangle. That leaves a small problem: the game can draw into corners you can't actually see.

Grain uses a rounded collision tray to keep the fleck inside the visible screen. The drawing area and the collision boundary have to agree, or the fleck can slide right into a clipped corner and vanish.

Explore the layers Framebuffer Visible screen Collision boundary Move toward the corner

Slide the fleck farther toward the corner, then try turning off the collision boundary.

Interactive diagram to show the idea, not exact hardware measurements or physics.

That's what I've been working through inside omalo. The main omalo page shows the whole device, including Grain, Pokémon, and the other firmware screens.

- [explore omalo](https://btuckerc.dev/projects/omalo)
Current limits and source

Goals can still fail, and I haven't proven out a full autonomous run of Pokémon Emerald. Each clip notes how it was captured, and the diagrams show the current design. I'll link the source here once it's ready to share.
