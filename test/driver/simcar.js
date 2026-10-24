
/* Z-DASH — simulated drive generator. Physics-ish model of Bob's 473 whp supercharged 370Z
   with a "driver" that cruises, accelerates, brakes and shifts (SynchroRev on downshifts).
   Shift quality varies so the scorer has PERFECT / GOOD / SLOPPY shifts to grade. */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});
  const C = ZD.CAR, clamp = ZD.clamp, lerp = ZD.lerp;
  const g0 = 9.81, J_ENGINE = 0.27; // kg·m² ZSP 19.5 lb steel flywheel + clutch + crank + Rotrex (reflected)

  function rand(a, b) { return a + Math.random() * (b - a); }

  class SimCar {
    constructor() {
      this.t = 0; this.v = 0; this.rpm = C.idle; this.gear = 0; this.th = 0; this.brake = 0;
      this.clutchDown = true; this.phase = 'neutral'; // locked | clutchIn | move | engage | neutral
      this.shift = null; this.latG = 0; this.lonG = 0; this.boost = -11; this.afr = 14.7;
      this.coolant = 150; this.oil = 140; this.iat = 85; this.volts = 14.2; this.timing = 15; this.ethanol = 80 + Math.random() * 4; // E85 pump fuel
      this.driver = new SimDriver(this);
      this.prevV = 0;
    }
    wheelTorqueLbft(rpm, th) {
      const full = ZD.interp(C.torqueCurve, rpm);
      const drag = 25 + rpm / 220; // engine braking when off throttle
      let tq = Math.pow(th, 0.85) * full - (1 - th) * drag;
      if (rpm >= C.limiter) tq = Math.min(tq, -drag); // rev limiter cut
      return tq;
    }
    resist(v) {
      return 0.5 * 1.2 * C.cd * C.frontalAreaM2 * v * v + (v > 0.1 ? C.crr * C.massKg * g0 : 0);
    }
    beginShift(to) {
      const d = this.driver, s = d.skill();
      const up = to > this.gear;
      this.shift = {
        from: this.gear, to, up, s,
        tIn: rand(0.06, 0.12),
        tMove: up ? 0.12 + 0.3 * (1 - s) + rand(0, 0.08) : 0.25 + 0.35 * (1 - s) + rand(0, 0.1),
        // clutch engagement time: smooth ~0.25-0.4s; sloppy = dumped (fast) or ridden (slow)
        tEng: s > 0.7 ? rand(0.24, 0.36) : s > 0.45 ? (Math.random() < 0.5 ? rand(0.15, 0.22) : rand(0.45, 0.6)) : (Math.random() < 0.6 ? rand(0.05, 0.1) : rand(0.65, 0.9)),
        synchroErr: (Math.random() < 0.5 ? -1 : 1) * rand(0, 60 + 200 * (1 - s)),
        pickup: 0.05 + 0.55 * Math.pow(1 - s, 1.5) + rand(0, 0.05),
        thAfter: d.targetTh, tc: 0,
      };
      this.phase = 'clutchIn'; this.clutchDown = true;
    }
    step(dt) {
      this.t += dt;
      this.driver.update(dt);
      const m = C.massKg, R = ZD.R;
      let Fdrive = 0, aExtra = 0;
      const Fb = this.brake * 1.05 * m * g0;
      const sh = this.shift;
      if (this.phase === 'locked') {
        this.rpm = Math.max(this.v * ZD.rpmPerMs(this.gear), 0);
        const tq = this.wheelTorqueLbft(this.rpm, this.th) * 1.3558;
        Fdrive = (tq * ZD.ratio(this.gear)) / R;
        Fdrive = Math.min(Fdrive, C.tractionG * m * g0);
      } else if (this.phase === 'neutral') {
        const target = C.idle + this.th * 6000;
        this.rpm += (target - this.rpm) * Math.min(1, dt * 6);
      } else if (sh) {
        sh.tc += dt;
        const vT = this.v * ZD.rpmPerMs(sh.to);
        if (this.phase === 'clutchIn' || this.phase === 'move') {
          this.th = Math.max(0, this.th - dt * 8);
          if (!sh.up) {
            // SynchroRev Match blips to the new gear's rpm (+ small error)
            const tgt = vT + sh.synchroErr;
            this.rpm += (tgt - this.rpm) * Math.min(1, dt / 0.07);
          } else {
            this.rpm = Math.max(C.idle, this.rpm - dt * (1950 + this.rpm * 0.15)); // 19.5 lb steel flywheel → moderate rev drop
          }
          if (this.phase === 'clutchIn' && sh.tc > sh.tIn) { this.phase = 'move'; sh.tc = 0; }
          else if (this.phase === 'move' && sh.tc > sh.tMove) {
            this.phase = 'engage'; sh.tc = 0; this.gear = sh.to; this.clutchDown = false;
            sh.relRpm = this.rpm;
          }
        } else if (this.phase === 'engage') {
          const p = clamp(sh.tc / sh.tEng, 0, 1);
          const tau = sh.tc >= sh.tEng ? 0.03 : Math.max(0.025, sh.tEng * 0.3); // clutch fully up → engine locks quickly
          const dRpm = (vT - this.rpm) * Math.min(1, dt / tau);
          const dOmega = (dRpm * 2 * Math.PI) / 60;
          // engine inertia dumped into (or pulled from) the car through the clutch
          aExtra = (-J_ENGINE * (dOmega / dt) * ZD.ratio(sh.to)) / (R * m);
          this.rpm += dRpm;
          sh.peakExtra = Math.max(sh.peakExtra || 0, Math.abs(aExtra));
          // throttle comes back in after the driver's pickup delay
          if (sh.tc > sh.pickup && sh.up) this.th = Math.min(sh.thAfter, this.th + dt * (2 + 4 * sh.s));
          const tq = this.wheelTorqueLbft(this.rpm, this.th) * 1.3558 * p;
          Fdrive = (Math.max(tq, 0) * ZD.ratio(sh.to)) / R;
          if (p >= 1 && (Math.abs(this.rpm - vT) < 60 || sh.tc > sh.tEng + 0.25)) {
            this.phase = 'locked'; this.lastLock = this.t;
            // harsh engagement sets off driveline shuffle (car bucks a few times) — a Stage 3 clutch makes this easy to do
            this.shuffle = { A: clamp((sh.peakExtra || 0) * 0.9, 0, 5), t: 0 }; this.shift = null;
          }
          
        }
      }
      if (this.shuffle && this.phase === 'locked') {
        const sf = this.shuffle; sf.t += dt;
        aExtra += sf.A * Math.exp(-sf.t / 0.35) * Math.sin(2 * Math.PI * 3 * sf.t);
        if (sf.t > 1.5) this.shuffle = null;
      }
      let a = (Fdrive - this.resist(this.v) - (this.v > 0.05 ? Fb : 0)) / m + aExtra;
      this.v = Math.max(0, this.v + a * dt);
      if (this.v === 0 && this.phase === 'locked') { this.phase = 'neutral'; this.gear = 0; this.clutchDown = true; }
      if (this.phase === 'locked' && this.rpm < 1000 && this.th < 0.05) { this.phase = 'neutral'; this.gear = 0; this.clutchDown = true; }
      // longitudinal g smoothed (what an accelerometer would show)
      const instG = (this.v - this.prevV) / dt / g0; this.prevV = this.v;
      this.lonG += (instG - this.lonG) * Math.min(1, dt * 12);
      this.updateEngineSensors(dt);
    }
    updateEngineSensors(dt) {
      const rpmN = this.rpm / C.redline;
      const boostMax = C.boostPeakPsi * rpmN * rpmN;
      const vac = this.rpm > 1500 && this.th < 0.03 ? -12.5 : -10.5 + this.th * 4;
      const target = this.th > 0.05 ? lerp(vac, Math.max(boostMax, vac), Math.pow(this.th, 1.4)) : vac;
      this.boost += (target - this.boost) * Math.min(1, dt * 7);
      let afrT;
      if (this.th < 0.02 && this.rpm > 1400 && this.phase === 'locked') afrT = 21.5; // decel fuel cut
      else if (this.boost > 1) afrT = 11.6;
      else if (this.th > 0.7) afrT = 12.4;
      else afrT = 14.7;
      this.afr += (afrT - this.afr) * Math.min(1, dt * 5);
      this.timing = this.boost > 1 ? 14 - this.boost * 0.6 : 18 + 14 * (1 - this.th) * clamp(this.rpm / 4000, 0, 1);
      this.coolant += ((190 + this.th * 12) - this.coolant) * dt * 0.02;
      this.oil += ((205 + this.th * 25 + rpmN * 15) - this.oil) * dt * 0.01;
      const soak = Math.min(65, Math.max(0, this.t - 200) * 0.6) * (this.boost > 0 ? 1 : 0.75); // demo: heat soak later in the drive
      this.iat += ((95 + Math.max(this.boost, 0) * 3 - this.v * 0.3 + soak) - this.iat) * dt * 0.08;
      this.volts = 14.1 + Math.sin(this.t * 0.7) * 0.08;
    }
    frame() {
      const n = (s) => (Math.random() - 0.5) * s;
      return {
        t: +this.t.toFixed(3),
        rpm: Math.round(this.rpm + n(12)),
        speed: +(this.v * ZD.MPH).toFixed(1),
        throttle: Math.round(this.th * 100),
        gear: this.phase === 'neutral' ? 0 : this.phase === 'locked' || this.phase === 'engage' ? this.gear : null,
        clutch: this.clutchDown,
        boost: +(this.boost + n(0.15)).toFixed(1),
        afr: +(this.afr + n(0.12)).toFixed(1),
        coolant: Math.round(this.coolant), oil: Math.round(this.oil), iat: Math.round(this.iat),
        timing: +this.timing.toFixed(1), volts: +this.volts.toFixed(1),
        ethanol: Math.round(this.ethanol),
        fuelLevel: Math.round(Math.max(3, 21 - this.t / 120 + Math.sin(this.t / 7) * 3 + this.latG * 6)), // sloshy, unreliable sender
        load: Math.round(clamp(25 + this.th * 75 + Math.max(this.boost, 0) * 4, 0, 160)),
        brake: this.brake > 0.02,
        latG: +(this.latG + n(0.02)).toFixed(2), lonG: +(this.lonG + n(0.02)).toFixed(2),
      };
    }
  }

  /** Scripted driver: loops through stop → launch → accelerate → cruise (with corners) → brake. */
  class SimDriver {
    constructor(car) {
      this.car = car; this.seg = { type: 'idle', t: 0, dur: 1.5 }; this.targetTh = 0; this.dynoRequested = false; this.style = 'cruise';
      this.cornerT = 0; this.cornerDur = 0; this.cornerG = 0;
    }
    skill() { const r = Math.random(); return r < 0.6 ? rand(0.75, 1) : r < 0.88 ? rand(0.45, 0.75) : rand(0.05, 0.45); }
    mph() { return this.car.v * ZD.MPH; }
    next() {
      const c = this.car, mph = this.mph();
      if (this.dynoRequested) {
        this.dynoRequested = false;
        return { type: 'dynoPrep', t: 0 };
      }
      const prev = this.seg.type;
      if (prev === 'idle' || prev === 'brake' && mph < 3) return { type: 'accel', t: 0, th: this.th(0.45, 1), shiftRpm: 0, target: rand(35, 75) };
      if (prev === 'accel' || prev === 'dynoPull') return { type: 'cruise', t: 0, dur: rand(4, 9), target: Math.min(mph, 80) };
      if (prev === 'cruise') {
        const r = Math.random();
        const bf = this.style === 'race' ? rand(0.45, 0.75) : Math.random() < 0.15 ? rand(0.5, 0.7) : rand(0.15, 0.3);
        if (r < 0.25) return { type: 'brake', t: 0, target: 0, force: bf };
        if (r < 0.65) return { type: 'brake', t: 0, target: Math.max(20, mph - rand(20, 40)), force: bf };
        if (this.style === 'race' && mph > 45 && r > 0.85) return { type: 'accel', t: 0, th: 1, target: 133 }; // highway pull (60-130)
        return { type: 'accel', t: 0, th: this.th(0.6, 1), target: Math.min(mph + rand(15, 35), 95) };
      }
      if (prev === 'brake') return { type: 'accel', t: 0, th: this.th(0.5, 1), target: mph + rand(20, 40) };
      return { type: 'idle', t: 0, dur: 1.5 };
    }
    shiftRpmFor(th) {
      if (this.style === 'race') return th > 0.85 ? (Math.random() < 0.15 ? rand(5600, 6500) : rand(6900, 7400)) : 3600 + th * 3000;
      return Math.random() < 0.12 ? rand(4200, 5200) : rand(2500, 3500); // cruise: mostly early, the odd late one
    }
    th(lo, hi) { return this.style === 'race' ? rand(Math.max(lo, 0.85), 1) : rand(0.22, 0.5); }
    update(dt) {
      const c = this.car, s = this.seg, mph = this.mph();
      s.t += dt;
      // corners (lateral g) while moving
      if (mph > 15) {
        this.cornerT += dt;
        if (this.cornerT > this.cornerDur) { this.cornerT = 0; this.cornerDur = rand(2.5, 6); this.cornerG = Math.random() < 0.45 ? rand(-0.95, 0.95) * clamp(mph / 50, 0.3, 1) : 0; }
        const target = this.cornerG * Math.sin((Math.PI * this.cornerT) / this.cornerDur);
        c.latG += (target - c.latG) * Math.min(1, dt * 4);
      } else c.latG *= 0.9;
      if (c.shift) return; // hands busy
      switch (s.type) {
        case 'idle':
          c.th = 0; c.brake = 0.2;
          if (s.t > s.dur) this.seg = this.next();
          break;
        case 'accel': case 'dynoPull': {
          c.brake = 0;
          if (!s.shiftRpm) s.shiftRpm = this.shiftRpmFor(s.th);
          this.targetTh = s.th;
          if (c.phase === 'neutral') {
            // launch in 1st: hold revs then roll into the clutch
            c.th = 0.3; if (c.rpm > 2200) { c.gear = 0; c.beginShift(1); c.shift.tIn = 0; c.shift.tMove = 0.05; c.shift.tEng = 0.8; c.shift.pickup = 0.2; c.shift.thAfter = s.th; c.shift.launch = true; }
            break;
          }
          c.th = Math.min(s.th, c.th + dt * 3);
          if (c.phase === 'locked' && c.rpm > s.shiftRpm && c.gear < 6 && !(s.type === 'dynoPull' && c.rpm < 7450)) {
            if (s.type === 'dynoPull') { this.seg = this.next(); break; }
            c.beginShift(c.gear + 1); s.shiftRpm = this.shiftRpmFor(s.th);
          } else if (mph > s.target && s.type === 'accel') this.seg = this.next();
          break;
        }
        case 'dynoPrep': {
          // get into 3rd around 2,600 rpm, then floor it
          c.brake = 0;
          if (c.phase === 'neutral') { this.seg = { type: 'accel', t: 0, th: 0.5, target: 30 }; this.dynoRequested = true; break; }
          const want = 2600 / ZD.rpmPerMph(3);
          if (c.gear !== 3 && c.phase === 'locked') {
            const to = c.gear < 3 ? c.gear + 1 : c.gear - 1;
            if (to < c.gear && mph * ZD.rpmPerMph(to) > 5000) { c.th = 0; c.brake = 0.4; break; } // slow down first, no money-shift
            c.beginShift(to); break;
          }
          if (mph > want + 4) { c.th = 0; c.brake = 0.3; }
          else if (mph < want - 4) { c.brake = 0; c.th = 0.25; }
          else { c.brake = 0; this.seg = { type: 'dynoPull', t: 0, th: 1, shiftRpm: 7480, target: 999 }; }
          break;
        }
        case 'cruise': {
          c.brake = 0;
          const err = s.target - mph;
          c.th = clamp(0.18 + err * 0.06, 0, 0.5);
          if (c.phase === 'locked' && c.rpm > 3800 && c.gear < 6 && s.t > 1.0 && c.t - (c.lastLock || 0) > 1.2) c.beginShift(c.gear + 1);
          if (s.t > s.dur) this.seg = this.next();
          break;
        }
        case 'brake': {
          c.th = 0; c.brake = s.force;
          if (c.phase === 'locked' && c.gear > 2 && c.rpm < 2300 && mph > 12) { c.brake = s.force * 0.6; c.beginShift(c.gear - 1); }
          if (mph <= s.target + 0.5 || mph < 1) {
            c.brake = s.target === 0 ? 0.25 : 0;
            if (s.target === 0) { if (mph < 0.3) { c.phase = 'neutral'; c.gear = 0; c.clutchDown = true; this.seg = { type: 'idle', t: 0, dur: rand(1.5, 3) }; } }
            else this.seg = { type: 'accel', t: 0, th: this.th(0.5, 1), target: mph + rand(15, 35) };
          }
          if (c.phase === 'locked' && c.rpm < 1300) { c.phase = 'neutral'; c.gear = 0; c.clutchDown = true; }
          break;
        }
      }
    }
  }

  ZD.SimCar = SimCar;
})(typeof window !== 'undefined' ? window : globalThis);

