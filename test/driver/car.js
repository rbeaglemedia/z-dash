
/* Z-DASH — car configuration (2010 Nissan 370Z 40th Anniversary, supercharged) */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});

  ZD.CAR = {
    name: '2010 Nissan 370Z',
    edition: '40th Anniversary',
    induction: 'Supercharged',
    peakWhp: 473,
    redline: 7500,
    limiter: 7600,
    idle: 750,
    gears: [3.794, 2.324, 1.624, 1.271, 1.0, 0.794], // CD009 6MT, 370Z application
    finalDrive: 3.692,
    frontTire: { width: 255, aspect: 35, rim: 19 },
    rearTire: { width: 295, aspect: 35, rim: 19 }, // Bob's rears — used for speed math
    massKg: 1633, // ~3,380 lb car + driver + fuel
    cd: 0.3,
    frontalAreaM2: 1.95,
    crr: 0.015,
    tractionG: 0.85, // street tyre launch/1st-gear limit
    // Gun Metallic (KAD) paint + silver multi-spoke wheels + dark tint
    colors: { body: '#5c6068', bodyHi: '#9aa0a8', bodyLo: '#26292e', wheel: '#cfd3d8', wheelDark: '#7d838b', glass: '#07090c', tire: '#121316' },
    // Wheel-torque curve (lb-ft at the wheels, engine-rpm basis) — shaped for a
    // centrifugal supercharger: torque keeps climbing with rpm. 355 lb-ft @ 7000 = 473 whp.
    torqueCurve: [
      [700, 120], [1500, 165], [2000, 195], [2500, 220], [3000, 245], [3500, 268], [4000, 290],
      [4500, 308], [5000, 324], [5500, 338], [6000, 350], [6500, 358], [7000, 355], [7300, 334],
      [7500, 318], [7700, 120],
    ],
    // Reference: approx. stock 2010 VQ37VHR on a Dynojet (for the ghost curve on the Dyno screen)
    // ZSP 19.5 lb billet steel flywheel: lighter than the stock dual-mass unit but much heavier
    // than an aluminium one — revs fall moderately between shifts. Stage 3 clutch grabs hard.
    flywheelLb: 19.5,
    clutch: 'ZSpeed Stage 3 Super Street HP',
    stockCurve: [
      [2000, 180], [2500, 195], [3000, 205], [3500, 215], [4000, 222], [4500, 232], [5000, 238],
      [5500, 236], [6000, 230], [6500, 222], [7000, 212], [7400, 200],
    ],
    boostPeakPsi: 8.5, // GTM Stage 1 Rotrex: typically ~7-9 psi (Omni 4-bar MAP reads to ~+29 psi)
    boostGaugeMax: 20,
    build: {
      power: 'GTM Stage 1 Rotrex supercharger · EcuTek tune',
      fuel: 'ID1050 injectors · AEM 340 E85 pump · Zeitronix flex-fuel (ethanol %)',
      driveline: 'CD009 6MT (new) · ZSpeed Stage 3 Super Street High Power clutch · ZSP billet steel 19.5 lb flywheel',
      breathing: 'GTM CAI · Invidia Gemini exhaust + test pipes · Omni 4-bar MAP',
      cooling: 'Setrab oil cooler · GTM bar-and-plate front-mount intercooler',
      chassis: 'BC Racing coilovers · Hotchkis sway bars',
      wheels: 'SSR GTX04 19 in, dark gunmetal 10-spoke (5 split pairs) (19x10.5 +35 confirmed from Bob\'s photo; docx said 19x9.5 +35 F / 19x10.5 +22 R, unconfirmed)',
      body: 'Stillen front bumper · z1 aluminum undertray · Gun Metallic',
    },
  };

  ZD.tireRadiusM = (t) => (t.rim * 25.4 + (2 * t.width * t.aspect) / 100) / 2000;
  ZD.R = ZD.tireRadiusM(ZD.CAR.rearTire); // ~0.3446 m
  ZD.ratio = (g) => (g >= 1 && g <= 6 ? ZD.CAR.gears[g - 1] * ZD.CAR.finalDrive : 0);
  ZD.rpmPerMs = (g) => (ZD.ratio(g) * 60) / (2 * Math.PI * ZD.R); // engine rpm per (m/s)
  ZD.rpmPerMph = (g) => ZD.rpmPerMs(g) * 0.44704;
  ZD.MPH = 2.23694;

  ZD.interp = (table, x) => {
    if (x <= table[0][0]) return table[0][1];
    for (let i = 1; i < table.length; i++) {
      if (x <= table[i][0]) {
        const [x0, y0] = table[i - 1], [x1, y1] = table[i];
        return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
      }
    }
    return table[table.length - 1][1];
  };
  ZD.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  ZD.lerp = (a, b, t) => a + (b - a) * t;

  /** Best-guess gear from rpm + speed (used when a source doesn't report gear). */
  ZD.inferGear = (rpm, mph, tol = 0.07) => {
    if (!(mph > 4) || !(rpm > 400)) return null;
    const r = rpm / mph;
    let best = null, bestErr = 1e9;
    for (let g = 1; g <= 6; g++) {
      const e = Math.abs(r / ZD.rpmPerMph(g) - 1);
      if (e < bestErr) { bestErr = e; best = g; }
    }
    return bestErr <= tol ? best : null;
  };
})(typeof window !== 'undefined' ? window : globalThis);

