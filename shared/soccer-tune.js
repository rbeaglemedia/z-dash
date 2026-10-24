'use strict';
// Car soccer on the Neon World split page. Distances are metres, mass is kilograms.
// The Z is 1.32 m tall (ZDM.h). diameterMul is ball diameter ÷ that height.
// 2.5 is the Rocket League read: bigger than the car, small enough that a nose hit still pops it.
// Half the pitch is a 3.0 s run at 60 mph: 60 * 0.44704 = 26.8224 m/s, * 3 = 80.47 m.
window.SOCCER_TUNE = {
  diameterMul: 2.5,   // ball diameter / car height. 2–3 is the big-ball range; 2.5 is the default.
  ballMass: 45,       // kg. Heavier soaks a tap; the car is still much heavier, so a fast nose launches it.
  carMass: 1480,      // kg. The Z. Only used for the hit (the car is not pushed back).
  bounciness: 0.55,   // restitution on the car, the ground, the lines, and the dome
  hitStrength: 1.12,  // scales the contact impulse. 1 = the momentum share alone.
  friction: 0.46,     // ground roll-out and the sideways grip on a car hit (spin)
  // Dome on The Field. West sideline is the tunnel mouth.
  // 104 m wide (fieldHw 52) by 160 m goal-to-goal (fieldHl 80). Center (1000, 1280):
  // x 948–1052, z 1200–1360. The z=1280 boulevard stops at the west sideline.
  fieldCx: 1000,
  fieldCz: 1280,
  fieldHw: 52,
  fieldHl: 80,
  // Boulevard along z=1280 from x=640 straight to the west sideline.
  roadX0: 640,
  roadX1: 948,
  roadZ: 1280,
  roadHalfW: 10,
  // Mouth, crossbar, and net depth. Bigger than the old ~15 x 7 goal.
  goalW: 34,
  goalH: 12.5,
  goalD: 11.5,
  // Elliptical dome footprint and crown. The shell clears the pitch; the west
  // bowl is open below 11.5 m so the entrance tunnel comes in at midfield.
  domeRx: 72,
  domeRz: 102,
  domeH: 48,
  // Drive-through tunnel. Bore z 287–313 is the road. Physics walls sit just
  // outside that bore and stop 6 m short of the sideline so the mouth stays open.
  tunnelX0: 860,
  tunnelX1: 948,
  tunnelWallX1: 942,
  tunnelZ0: 1267,
  tunnelZ1: 1293,
  tunnelH: 11.5,
  tunnelRoof: 15,
  showScore: false    // score pill stays off until the scoreboard comes back. GOAL! still flashes.
};
