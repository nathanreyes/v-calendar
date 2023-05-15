const watchSkippers: Partial<Record<string, number>> = {};

export const skipWatcher = (watcher: string, durationMs = 10) => {
  watchSkippers[watcher] = Date.now() + durationMs;
};

export const unskipWatcher = (watcher: string) => {
  delete watchSkippers[watcher];
};

export const handleWatcher = (watcher: string, handler: Function) => {
  if (watcher in watchSkippers) {
    const dateTime = watchSkippers[watcher] as number;
    if (Date.now() < dateTime) return;
    delete watchSkippers[watcher];
  }
  handler();
};
