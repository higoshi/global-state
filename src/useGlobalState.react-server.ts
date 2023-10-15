const snapshotMap = new Map<Symbol, unknown>();

export function useGlobalState<T>(symbol: Symbol, initialSnapshot: T) {
  if (!snapshotMap.has(symbol)) {
    snapshotMap.set(symbol, initialSnapshot);
  }

  function getSnapshot() {
    return snapshotMap.get(symbol) as T;
  }

  return [
    getSnapshot(),
    (arg: T | ((oldState: T) => T)) => {
      if (arg instanceof Function) {
        const newSnapshot = arg(getSnapshot());
        snapshotMap.set(symbol, newSnapshot);
        return newSnapshot;
      } else {
        snapshotMap.set(symbol, arg);
        return arg;
      }
    },
  ] as const;
}
