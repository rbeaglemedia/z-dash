# Tow cab collision

Headless Chrome, `world-split.html`, one browser at a time. The Z was placed overlapping the front of a live tow cab at 0 m/s with throttle held. 90 frames at 1/60 s.

A hit must be one impulse: the cab lets go, speed climbs under full throttle, the runway BUMP toast does not re-fire, and the Z is not left PARKED inside the cab.

| size | viewport | mode | hits | speed | throttle | BUMP toasts | inside cab | parked | pull-away |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| phone | 390×844 | phone | 1 | 0 → 6.5 → 30.9 m/s | 100% | 0 | no | no | 11.1 m → 19.7 m |
| iPad | 1024×768 | ipad | 1 | 0 → 6.5 → 30.9 m/s | 100% | 0 | no | no | 11.1 m → 19.7 m |
| PC | 1440×900 | pc | 1 | 0 → 6.5 → 30.9 m/s | 100% | 0 | no | no | 11.1 m → 19.7 m |

Pass on all three. Other traffic vehicles were not changed. Not deployed.
