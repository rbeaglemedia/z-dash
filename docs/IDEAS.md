# Neon World ideas for Ellie

Ideas only. This file does not change the game, and it does not deploy.

Kid App only (`world.html` / `world-split.html`, live at z.beagle.games). Adult `index.html` stays untouched.

Written for Bob, about Ellie: 10, playing at about a 13-year-old level. She likes Brookhaven (clean bright modern homes, glass walls, cyan neon strips, avatar-style people), Fortnite, Minecraft, and dance. Her studio is Z Company Arts. The car is the 2010 370Z. Fake kid-car stuff (NOS, a turbo button, wings, flying) is in bounds.

## What this is grounded in

Read on 24 Oct 2026:

- Live city in `world/city.js` (seed 90210): six districts (Spawn & Runway South, Arts & Garage, West Parkside, Downtown Core, East Sports & Track, Waterfront City Builder), two Z Company Arts studios, her house, glass showrooms, pizza & boba cafes, pet lounges, arcades, garages, NOS depots, sky-drop pads, the 239 m sky tower, the dome stadium, the track, the river, the west tunnel, and the empty sandlot north of the river.
- Driving and play that already ship: arcade and street, wings, ground and air NOS, e-brake, donuts, brake trails, four surfaces, ramps, the loop, the half-pipe, hoops, sky rings, tow trucks, traffic, car soccer with a score, sky drop, hot drop, sky whip, on-foot walk / run / jump, the emote wheel (Dance 1, Dance 2, Pet Groove, Hype Spin), building interiors, home wall / furniture / pet bed / sign, neon paint, the 3-level garage and vinyls, the crew (hair, outfit, glow) and pets (fox, cat, dragon pup, robo-dog), the dance stage and camera recorders, the minimap, coins and stars.
- In flight, so treated as already planned: bright day rooms, the room prop sheet, the jointed closet, the companion pet on the garage turntable, the WebGL city prototype, and the speed work. Pet Battles is a later idea and is not pitched here.
- `docs/SPEED-PLAN.md` on branch `cursor/speed-plan-3b68` (pull request 63). There is no `NEON-WORLD-STYLE.md` or `CITY-LAYOUT-PLAN.md` in this repo or on any branch. The brand below is the live look: night neon (cyan `#3ee6ff`, pink `#ff4fd8`, lime `#7dff6b`, amber `#ffb020`, yellow `#ffe14d`), Orbitron labels, and the bright glass rooms already aimed at home, cafe, pets, and the showroom.

Frame budget this list respects: a steady 110 on a Galaxy (a frame under about 9 ms), and a flat 30 as the acceptable floor on the 2018 base iPad. New ideas stay off `shadowBlur`. Interiors already pause the outdoor city, so a room activity stays inside that pause. The ceiling for a phone idea is one extra person, a few extra lines, or a baked picture.

Effort words: **small** is a label, a toast, or a save field on a system that already draws. **Medium** is one short activity. **Large** is a sequence, several rooms, or a second person in the car.

A line marked **scales up** is safe on the phone and is also a prototype for the PC game. The PC versions are written out at the bottom.

## Top 5 picks

1. **Z Company class cards.** Three real class names inside the studio she already walks into. The dance clock she already has grades the 8-count. This is the idea that is hers, and it is cheap.
2. **Pizza run.** One box from the cafe to a door on a timer. Brookhaven errands, with no new cars and no new people.
3. **Selfie frames.** Four fixed spots, one saved picture. The photo habit from Roblox, using a snapshot the page can already take.
4. **Her best lap, drawn as a neon ribbon** on the track that already exists. A rival she can see, made of that one line.
5. **One local friend in the passenger seat** who dances when she honks. The biggest of the five, still one extra person, and the seed of a PC crew.

## Quick wins

1. **Bumper plate.** She types a short plate (up to 7 letters) and it sits on the bumper in the same sign style as the city. She would love the Z to say her name the way a Brookhaven house does. FPS low. Effort small.
2. **Selfie frames.** Four marks she can stand in: the glass house, the Z Company steps, the stadium tunnel, the sky-tower pad. A tap saves one picture of that view. She would love posting a fit-check and a landing the way she does in Roblox. FPS low. Effort small. Scales up.
3. **Studio beeps.** A new small horn button with three short sounds: a "5, 6, 7, 8" count-in, a two-note hello, and a NOS chirp. `world/sound.js` is still an empty stub, and the garage "horn" tab is the unicorn-horn hat, so this is the first real car horn. She would love counting herself in and calling the pet. FPS low. Effort small.
4. **Clean-bay star.** Stopping inside a parking bay that already exists, under a calm speed, awards one star in the save she already has, with the usual toast. She would love the driveway flex from Brookhaven. FPS low. Effort small.
5. **Dance-name billboard.** One highway billboard reads the name of the dance she last saved, and falls back to Z COMPANY ARTS. She would love seeing her own routine on the skyline. FPS low. Effort small.
6. **Cafe order.** The cafe already hands out points. A card of three drinks (boba, citrus, ice) tints her outfit glow to a color she already owns, for about 30 seconds. She would love a Brookhaven snack run that changes her look. FPS low. Effort small.
7. **Pet name tag.** A name she types floats over the pet when she is close, stored in the pet save. She would love naming the fox the way she names pets everywhere else. FPS low. Effort small.
8. **Personal records.** The pause card shows three numbers she already earns: clean landings, soccer goals, and best dance combo. She would love a career page that treats her driving and her dancing as the same hobby. FPS low. Effort small.

## Medium

9. **Z Company class cards.** Hip-hop, contemporary, and freestyle, each an 8-count on the studio floor. Floor lines tick with the beat. A grade (clean, close, miss) comes from timing, and the best grade sticks on the personal-records card. She would love a class from her real studio inside the game. FPS low. Effort medium. Scales up.
10. **Pizza run.** Pick up one box sprite at Neon Pizza & Boba, drive it to a marked door, beat a clock. The box is one picture, the door is one she already has, and there is no new driver. She would love a Fortnite-style drop with a Brookhaven chore. FPS low. Effort medium. Scales up.
11. **Lap ribbon.** Her best loop of the existing track is saved as positions and drawn as one neon line she can chase. She would love racing herself the way a time trial does, and she can read the line. FPS low. Effort medium. Scales up.
12. **Rooftop pose course.** Three marks on the sky-tower pad. She gets out, hits an emote she already owns, and the next mark lights. She would love a fashion walk on a roof, which is the Brookhaven and Fortnite overlap. FPS low. Effort medium.
13. **Dance ghost.** Inside Z Company only, a second copy of her figure plays her last saved take beside her. The outdoor city stays paused, which interiors already do. She would love dancing against herself the way the improve app compares a clip, now on the floor. FPS med. Effort medium. Scales up.
14. **Showroom meet.** A row of parked traffic pictures (already baked) lines the showroom lot. Cruising past them slowly earns a horn reply and a meet star. None of them are simulated. She would love a car meet for the 370Z. FPS low. Effort medium. Scales up.
15. **Stadium challenges.** Three named shots on the ball that already rolls: bank it off the tunnel wall, stop it in the center circle, score from the west mouth. Her goal count still ticks. She would love trick-shot goals the way she likes creative Fortnite plays. FPS low. Effort medium. Scales up.
16. **Late-afternoon city.** One alternate palette for the sky clear-color and the sign colors, on a timer of a few minutes, then back to night. No new lights and no shadows. This is a picture change, so it waits for a yes after side-by-side shots. She would love the bright Brookhaven afternoon matching the day rooms. FPS low. Effort medium. Scales up.

## Big

17. **Passenger friend.** One local kid sits in the passenger seat the crew rig already knows, with a name, a hair, and an outfit from the colors she already has. A studio beep makes them dance in the seat. They are not on the network. She would love driving up with a studio friend. FPS med. Effort large. Scales up.
18. **Z Company parade.** On a button outside the studio, her pet and two baked traffic pictures follow a fixed line down the arts street while she dances. The line is a fixed path. She would love leading a dance line the way a recital ends. FPS med. Effort large. Scales up.
19. **Street of regulars.** Four buildings that already stand (her house, the downtown studio, the arcade, the cafe) each gain a named regular and a short room card: a hello, one favor, one emote. The outdoor city does not grow. She would love a block of people who know her, which is the Brookhaven loop. FPS low. Effort large. Scales up.
20. **Recital night.** A one-minute script inside Z Company: lights, her class card, the pet groove, a bow, then a toast and a star. It chains systems she already has. She would love a show with a start and an end. FPS med. Effort large. Scales up.
21. **Glide gates.** A marked run from the arts-district sky pad to the sky tower: five hoops of the kind that already refill NOS, plus a time on the personal-records card. Wings and flying stay as they are. She would love a Fortnite glide with a score. FPS low. Effort medium.
22. **Rail rival.** One traffic picture rides a fixed lap of the track just ahead of her ribbon. Beating it to the line saves a win. The rival is a picture on a rail, the same way distant traffic is already a picture. She would love a named rival for the 370Z. FPS med. Effort large. Scales up.

## Future PC game

The phone game should stay a small neon city that holds its frame. These are the same ideas after a real graphics chip, a big screen, and room for more than one person. Build the phone version first. The PC version inherits the save (plate, pet name, dances, records, ribbon) so the phone game is the prototype the PC continues.

- **A crew, for real.** The passenger friend becomes friends who can ride, walk the glass block, and dance in the studio. The phone proves the seat, the name, and the dance. The PC adds the network.
- **A recital with a room.** Class cards, the dance ghost, and recital night become a skinned show: a small audience, a real stage, her recorded take on a proper body. The phone proves the class list and the grade.
- **Rivals who actually drive.** The lap ribbon and the rail rival become a second car with its own lap. The phone proves the line and the win. The PC pays for the second car.
- **A street of houses.** The street of regulars, the day rooms, and the prop sheet become a row of glass homes she can walk between, with rooms that stay loaded. The phone proves the people and the bright kit. The PC streams the block.
- **The sandlot, as a real editor.** North of the river is already the builder zone, and it is a toast today. On PC that plot can become a Minecraft-style lot (place, paint, save) under the neon brand. On the phone, leave it empty. A voxel editor on the canvas would miss the frame.
- **Photo mode and a replay.** Selfie frames become a free camera, a replay of a lap, and a short clip of a recital. The phone proves the four spots and the saved picture.
- **A sun, and weather.** The late-afternoon palette becomes a real sky, a glass-house sunset, and rain on the 370Z. The phone proves she likes the bright hour. The PC draws it.
- **On-foot soccer in the dome.** Car soccer stays the phone sport. On PC the same pitch can host her and a friend on foot, plus the car. The phone proves the field, the goals, and the challenges.

## Left alone on purpose

These are already in the game, already in a pull request, or already a later idea: pet battles, more paint and vinyls, the closet, the prop sheet, day rooms, a second player car, barrel rolls, a wanted chase inside Neon World, a full city editor on the phone, WebGL as a feature, and any new glow that depends on `shadowBlur`.
