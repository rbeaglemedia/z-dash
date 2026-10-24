// Bounded undo / redo of whole-layout snapshots (plain JSON strings: no GPU objects are ever kept in history).
export const HISTORY_CAP = 100;
export function createHistory(cap = HISTORY_CAP) {
  let past = [], future = [], cur = null;
  return {
    reset(snap) { past = []; future = []; cur = snap; },
    // Call after every action; only real changes become steps. Returns true when a step was added.
    record(snap) { if (cur === null) { cur = snap; return false; } if (snap === cur) return false; past.push(cur); if (past.length > cap) past.shift(); future = []; cur = snap; return true; },
    undo() { if (!past.length) return null; future.push(cur); cur = past.pop(); return cur; },
    redo() { if (!future.length) return null; past.push(cur); if (past.length > cap) past.shift(); cur = future.pop(); return cur; },
    get canUndo() { return past.length > 0; }, get canRedo() { return future.length > 0; }, get size() { return past.length + future.length; }, get current() { return cur; },
  };
}
