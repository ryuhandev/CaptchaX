// Global browser-slot semaphore: hanya 1 solve browser dalam satu waktu.
// Mencegah N request paralel = N proses Chrome = OOM di Railway.
const MAX_SLOTS = 1;
let holders = 0;
const queue = [];

function acquireSlot(waitMs) {
  return new Promise((resolve) => {
    const item = { resolve, timer: null };
    item.timer = setTimeout(() => {
      const i = queue.indexOf(item);
      if (i >= 0) queue.splice(i, 1);
      resolve(false);
    }, waitMs);
    if (item.timer.unref) item.timer.unref();
    if (holders < MAX_SLOTS) {
      holders++;
      clearTimeout(item.timer);
      resolve(true);
    } else {
      queue.push(item);
    }
  });
}

function releaseSlot() {
  const next = queue.shift();
  if (next) {
    clearTimeout(next.timer);
    next.resolve(true);
  } else if (holders > 0) {
    holders--;
  }
}

function browserSlotStatus() {
  return { holders, queued: queue.length, max: MAX_SLOTS };
}

module.exports = { acquireSlot, releaseSlot, browserSlotStatus };
