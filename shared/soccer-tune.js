'use strict';
// Car soccer on the Neon World split page. Distances are metres, mass is kilograms.
// The Z is 1.32 m tall (ZDM.h). diameterMul is ball diameter ÷ that height.
// 2.5 is the Rocket League read: bigger than the car, small enough that a nose hit still pops it.
window.SOCCER_TUNE = {
  diameterMul: 2.5,   // ball diameter / car height. 2–3 is the big-ball range; 2.5 is the default.
  ballMass: 45,       // kg. Heavier soaks a tap; the car is still much heavier, so a fast nose launches it.
  carMass: 1480,      // kg. The Z. Only used for the hit (the car is not pushed back).
  bounciness: 0.55,   // restitution on the car, the ground, and the boundary lines
  hitStrength: 1.12,  // scales the contact impulse. 1 = the momentum share alone.
  friction: 0.46      // ground roll-out and the sideways grip on a car hit (spin)
};
