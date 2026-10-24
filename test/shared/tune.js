'use strict';
// ===== TUNABLES =====  (WINGS = starter Garage setup: floaty, momentum-heavy arcade flight)
const PRESETS = { wings: {
  jetEngines: false,                          // later jet setup: exhaust tips become long jet flames (stub, off)
  transformTime: 1.8,                         // s for the car<->glider transform (approved zglide timing)
  bankRate: 65, maxBank: 75, turnK: 1.6,     // roll rate deg/s, max bank deg, how hard bank turns (GTA: tight banked turns)
  rollTime: 0.9, rollTilt: 1.6,               // BARREL ROLL: s per full 360; tilt past rollTilt x tiltRange (or double-tap ←/→, Z/C) triggers it
  flipPitch: 30, flipSpeed: 36,               // STALL FLIP: nose above flipPitch deg while slower than flipSpeed m/s
  flipRate: 30, flipDive: 15, flipTime: 1.6, // nose-over rate deg/s, dive angle where control returns, max s without control
  pitchRate: 45, maxPitch: 75,                // deg/s, deg (glider: twitchy)
  autoLevel: 0.7,                             // per-second pull back to neutral when stick centred
  gTiltDead: 1.5, gTiltSpan: 12.1,   // wheels-down tilt map = Z TAKEOVER (gentle): 1.5 deg deadzone, full at 1.5+22*0.55 deg, ^0.8 curve, unsmoothed
  groundSteer: 1.5,   // wheels-down steering gain vs 91a89dd (applied instantly on traction, no smoothing)
  tiltRange: 28, deadZone: 0.09, tiltSmooth: 0.06,  // full command at 28 deg phone tilt from TILT CENTER (rate command), deadzone 0.09*28 = 2.5 deg, smoothing s
               // deg of phone tilt = full input
  maxSpeed: 90,                               // m/s at 100% throttle
  momentum: 0.12,                             // drag: fraction of speed-gap closed per s (low = carries speed a long way)
  thrUp: 2.5, thrDown: 0.8,                   // HOLD THROTTLE: ramp up per s while held, down per s when released (coast)
  gravityK: 4,                                // speed traded for climb/dive (low = arcade)
  airBrake: 9,                                // m/s^2 extra decel
  minFlySpeed: 0,                             // floor speed in the air (0 = can slow almost to a stop)
  stallSpeed: 30,                             // m/s: below this the nose gently sinks
  stallSink: 6,                               // deg/s nose sink at zero speed (soft stall)
  lowSpeedLift: 0.85,                         // lift kept at zero speed (1 = never sinks)
  sinkMax: 9,                                 // m/s sink when lift is 0
  nosBoost: 1.6,                              // NOS multiplies max speed
  softSink: 3.0,                              // touchdown: max descent m/s for a soft landing
  softMaxSpeed: 22,                           // touchdown: max forward m/s for a soft landing (~80 km/h)
  softMinPitch: -8,                           // touchdown: nose can't be lower than this (deg)
  groundFric: 0.5, groundBrake: 14,           // rolling decel m/s^2, wheel brake (plain AIR BRAKE hold on the ground; unchanged)
  // --- ground E-BRAKE: hold AIR BRAKE and drag right. Air brake (airBrake) is not used on the ground.
  // Path yaw rate = stick * 0.6 * groundSteer * min(1, v/5) * eBrakeSteer. eBrakeSteer 2.8 is the 2.5–3x band.
  // One gesture: slow + hard tilt pivots (small slip, faster bleed); fast + moderate tilt sweeps (big slip, mild bleed).
  // Throttle held at the same time holds speed and spins a donut. Releasing blends grip back (no snap).
  eBrakeDrag: 40, eBrakeBack: 16,             // px right to engage; slide back under eBrakeBack disengages
  eBrakeSteer: 2.8,                           // yaw-rate multiplier vs normal ground steering (all speeds; ratio stays 2.8x)
  eBrakePivotMph: 25,                         // below this, hard tilt blends toward the pivot (faster bleed, small slip)
  eBrakeDecel: 1.6, eBrakePivotDecel: 4.5,    // extra m/s^2 while sliding (no throttle coast); pivot blend is still far under groundBrake 14
  eBrakePivotYaw: 0.42,                       // while a slow hard tilt bleeds speed, keep this much of the full yaw scale so a U-turn finishes. Does not change the 2.8x rate above 5 m/s
  eBrakeDonutV: 8, eBrakeDonutSpool: 2.0,     // throttle+e-brake: spool up to this m/s (~18 mph), then hold speed (no bleed)
  eBrakeSlipSlow: 14, eBrakeSlipMax: 42,      // deg nose leads travel: small in a pivot, up to ~42 once at eBrakeSlipFullMph
  eBrakeSlipMph0: 18, eBrakeSlipFullMph: 36,  // drift angle stays small until slipMph0, full sweep angle at slipFullMph
  eBrakeSlipSteer: 0.34,                      // |tilt| that counts as a moderate steer (full drift angle)
  eBrakeDonutSlip: 38,                        // deg rear hang-out while throttle is held with the e-brake
  eBrakeSlipIn: 6, eBrakeAlign: 3.4,          // 1/s drift angle in, and back to 0 on release
  eBrakeIn: 0.1, eBrakeOut: 0.42,             // s blend in / out (turn rate, grip, camera)
  eBrakeRoll: 7,                              // deg visual body roll at full tilt (draw only)
  eBrakeSmoke: 14, eBrakeDonutSmoke: 2.6,     // tire-smoke puffs/s, and the donut multiplier
  eBrakeSkidLife: 5.4,                        // s skid marks last before they fade
  waterDrag: 1.1,                             // RIVER: in the water (sunk 0.6 m) speed decays at this rate /s on top of off-road drag; she drives back out
  offRoad: 0.55,                              // OFF-ROAD (grass / dirt / park, fully rolling only): ground accel x this, rolling drag x (1 + 2*(1-this)); paved = 1
  nosTank: 6, nosRefill: 0.15,               // NOS bottle: seconds of hold when full, refill per s (UI bottle drains)
  wingLiftTf: 0.7,                            // wings must be this far open (0..1 of the hinge anim) before the ground lets go
  closedSink: 7, closedClimb: 0.25,           // air with wings CLOSED: extra sink m/s, fraction of normal climb from pitch
  airThrust: 0.12,                             // AIR: throttle push m/s^2 (wheels in the air: weak, cannot hold level flight)
  airNos: 0.12,                                  // AIR: NOS push m/s^2, ONLY with THROTTLE held (bottle = 6 s)
  cd: 0.000075, ci: 4500, ciMax: 1.5,            // AIR drag = cd*v^2 + min(ci/v^2, ciMax): least drag ~2.5 m/s^2 at ~60 m/s, more when slow or fast
  gravityAir: 9.8,                            // AIR: climbing costs / diving gains g*sin(pitch) (full gravity trade)
  bankDrag: 1.5,                              // AIR: extra drag from banking (x (1/cos(bank) - 1))
  liftFullSpeed: 55,                          // AIR: full lift at/above this m/s (~210 km/h); lift falls with (v/this)^2, times cos(bank)
  airSinkMax: 14,                             // AIR: sink m/s with zero lift
  geH: 3, geMin: 0.06,                        // ground effect: within geH m of the ground sink fades to geMin (lets BUTTER LANDING work)
  roughSpeed: 60, wobble: 35,                 // below roughSpeed in the air: rough, shaky (bank wobble deg/s); liftoff under it = TOO SLOW!
  // --- momentum model (fly3mom) ---
  pitchResp: 3.5, pitchStab: 13,              // pitch inertia: nose rate chases stick at pitchResp/s; weathervane toward the flight path (x (v/liftFullSpeed)^2)
  alpha0: 3, alphaL: 8, clMax: 1.4, alphaStall: 14,  // lift coeff = (AoA+alpha0)/alphaL deg, capped clMax; above alphaStall deg lift collapses
  cdi: 0.03, floatLift: 1.0,  // low-speed lift helper: dynamic-pressure factor gets + floatLift*vr*(1-vr) below liftFullSpeed (glider can be flown slow, nose up)
                                  // induced drag x CL^2
  closedLift: 0.2,                            // AIR with WINGS CLOSED: share of lift left (sinks)
  geLift: 0.12,                               // ground effect: up to +8% lift within geH m (small cushion)
  liftAccel: 2.5, liftT: 1.6,                 // liftoff: upward accel capped at liftAccel m/s^2 for liftT s (floats off, no jump)
  maxNz: 50,                                  // max path-bending accel m/s^2 (~1.8 g)
  rotPitchMax: 12,                            // nose-up allowed on the runway once rotate speed + wings 100% open
  slideK: 0.7, slipMax: 40,                                 // turns: flight path heading catches the nose heading at this rate /s (slide ~1-3 s)
  slipDrag: 0.35,                             // drag from sliding sideways (x g x |sin slip| x (v/vf)^2)
  buffet: 50,                                 // turbulence deg/s^2 near stall / low speed (physical buffeting)
  softSink: 2.5, butterSink: 1.2, butterKmh: 10,               // touchdown: sink <= softSink and nose not down = clean; BUTTER only under butterKmh
  crashSink: 14, crashPitch: 30, crashSpeed: 60,   // WRECKED: sink > crashSink, or nose down > crashPitch deg, or > crashSpeed m/s with nose down >3 deg, or upside down
  roughKeep: 0.6, dipDeg: 4,                  // ROUGH LANDING keeps 60% speed, nose slams down dipDeg
  gSpring: 40, gDamp: 9,                      // runway pitch spring (nose dip/suspension settle)
  wreckFric: 14, wreckCard: 1.7,              // WRECKED grinding slide decel m/s^2; card after s
  // --- fly3float ---
  floatH: 4, floatSink: 1.2, floatSinkLow: 0.35, floatV: 35, floatEnter: 4,  // float only when slower than floatV m/s and sinking less than floatEnter m/s;  // WINGS open below floatH m: sink limited to floatSink m/s, easing to floatSinkLow at the ground (float to a stop)
  bumpSink: 7.5,                              // touchdown sink <= bumpSink (not crash) = BUMP! (keeps speed), above = ROUGH
  swoopK: 2.2, swoopMax: 1.2,                                // energy carry: pulling out of a dive at speed returns swoopK x (pull g) m/s^2 of the drag
  diveBankDrag: 0.3,                          // banked turns while diving cost only this share of bankDrag
  // --- fly3high ---
  swoopGam: 3,   // swoop bonus only while the path is still below this (deg): no free energy from holding a pull
  ovV: 85, ovK: 0.05,   // overspeed drag above ovV m/s (~190 mph): terminal dive ~105 m/s (~235 mph)
  hpDrag: 12, hpG: 2, hpPath: 20, hpPay: 20,   // hard pull-up cost: m/s^2 of drag per g of pull above hpG (big dive+pull loses ~half the height)
  climbG: 1.5, diveG: 2.15,                    // gravity trade along the path: climbs cost climbG x g x sin, dives gain diveG x g x sin (arcade momentum)
  pullBoost: 4.5,                             // pull-outs: pitch rate x this while diving fast (quick pull-up)
  // NOS bottle = WANTED: Z TAKEOVER (jr.html W4N): Garage tank tier from localStorage 'zdash.kid.v1' -> eq.nos;
  // taps per full bottle = 3 x (tier index+1) (STOCK 3, BIG 6, RACE 9, LEGEND 12), each tap burns 1.1 s (hold = continuous), refill 0.06 bottle/s while playing (air and ground)
  nosPerTier: 3, nosChunkT: 1.1, nosFill: 0.06,
  pullLift: 1.2,                              // pull-outs from a dive: extra lift x(1+pullLift) so a steep dive pulls up to a climb in ~1-2 s
  pullNz: 220, pushStab: 0.25,               // dive pull-outs may bend the path up to pullNz m/s^2 (arcade, last-second saves); full push weakens nose weathervane to pushStab so she can point straight down
  pullStab: 0.35, pullLift2: 1.6,            // pulls at speed: weathervane x pullStab (nose can lead the path more) and lift x(1+pullLift2*stick) above 0.8x liftFullSpeed
  impactKeep: 0.9, impactExp: 1.2,           // hard touchdowns keep impactKeep*cos(nose-down angle)^impactExp of speed (10deg 0.88, 45deg 0.6, 90deg 0)
  rebK: 0.25, rebMax: 6,                     // ROUGH hit rebound vertical m/s = min(rebMax, rebK*sink) (6 m/s ~ 1.8 m); second contact within 2 s just thuds down
  skimDeg: 13, skimKeep: 0.96, skimK: 0.45, skimMax: 4, skimSpeed: 30,  // shallow hit (path < skimDeg, faster than skimSpeed m/s, sink > softSink): keep 96% speed, bounce up min(skimMax, skimK*sink) m/s
  hardRebK: 0.06, hardRebMax: 2.5,   // HARD HIT rebound: small, damped hop (m/s up per m/s of sink, capped)
  crashPathDeg: 60, crashNoseDeg: 65, crashSlowV: 15,  // HARD HIT (never a reset; moving faster than crashSlowV m/s): flight path steeper than crashPathDeg, or nose down past crashNoseDeg; slow falls use crashSink
  maxDive: 89,                                // nose-down limit deg (~straight down); nose-up stays maxPitch 75
  allowLoop: false,                           // FUTURE pitch-only loop with auto wings-level/upright after. NOT implemented/enabled
  rotateSpeed: 48,                            // GROUND ONLY: no lift until this speed (m/s, ~173 km/h); airborne flight ignores it
  groundAccel: 0.24,                          // ground spool rate toward throttle speed (lower = longer run-up)
  groundPitchMax: 3,                          // deg of nose-up allowed while rolling below rotateSpeed
  bounce: 0.45,                               // bounce strength on a hard hit
  startAlt: 120, startSpeed: 55, startThrottle: 0.6,
  // --- air E-BRAKE ("Sky Whip" aerial U-turn / air drift) ---
  eBrakeAirSteer: 3.1,                        // mid-air whip yaw-rate multiplier (~180 deg U-turn in ~1.1 s)
  eBrakeAirPivotYaw: 0.65,                    // minimum yaw scale at low airspeed so slow air U-turns always finish
  eBrakeAirDecel: 12.0,                       // m/s^2 speed bleed while whipping broadside in the air
  eBrakeAirFloorV: 14.0,                      // minimum airspeed (m/s, ~31 mph) kept during an air e-brake so she never stalls to 0 mid-whip
  eBrakeAirDonutV: 20.0,                      // throttle + air e-brake holds ~45 mph for a continuous banked 360 sky-spin
  eBrakeAirSlipMax: 58,                       // deg nose leads flight path in the air (wider than 42 deg ground drift so the Z + wings whip broadside)
  eBrakeAirDonutSlip: 54,                     // deg slip during throttle + air e-brake spin
  eBrakeAirBank: 38,                          // deg bank into the whip turn (looks distinctly aerial, not flat like pavement)
  eBrakeAirRoll: 12,                          // deg extra visual body roll into the whip
  eBrakeAirFlarePitch: 11,                    // deg nose-up flare kick while whipping around in the air
  eBrakeAirSinkMax: 1.8,                       // m/s max sink rate while air e-braking (air-cushion flare so a U-turn doesn't drop like a rock)
  // --- airborne THROTTLE + NOS, wings open ---
  airNosAccel: 18,                            // extra forward m/s^2 while flying, only below airCruiseMax
  airNosLiftBoost: 1.25,                      // lift multiplier, plus upward path assist when the nose is level or up (every airspeed)
  // --- starter glider level/powered airspeed. Dives and Sky Drop are not capped (later prop ~180 mph, jet ~225–250). ---
  airCruiseMax: 65,                           // m/s (~145 mph) max powered or level airspeed, just above liftFullSpeed 55
  airCruiseDrag: 0.38                        // 1/s settle back to airCruiseMax once level or climbing; 0 while diving
} };
const TUNE = Object.assign({}, PRESETS.wings);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), D=Math.PI/180;
