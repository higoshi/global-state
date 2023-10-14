import React from 'react';

type Listener = () => unknown;

type Store<T> = {
  listeners: Listener[];
  subscribe: (listener: Listener) => () => unknown;
  snapshot: T;
  getSnapshot: () => T;
  mutate: (newSnapshot: T) => unknown;
};

const storeMap = new Map<Symbol, Store<unknown>>();

function getStore<T>(symbol: Symbol, initialSnapshot: T) {
  if (!storeMap.has(symbol)) {
    const store: Store<T> = {
      listeners: [],
      subscribe: (newListener: Listener) => {
        store.listeners.push(newListener);
        return () => {
          store.listeners = store.listeners.filter(
            listener => listener !== newListener
          );
        };
      },
      snapshot: initialSnapshot,
      getSnapshot: (): T => {
        return store.snapshot;
      },
      mutate: (newSnapshot: T) => {
        store.snapshot = newSnapshot;
        for (const listener of store.listeners) {
          listener();
        }
      },
    };

    storeMap.set(symbol, store as Store<unknown>);
  }

  return storeMap.get(symbol)! as Store<T>;
}

export function useGlobalState<T>(symbol: Symbol, initialState: T) {
  const store = getStore(symbol, initialState);

  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot);

  return [
    state,
    (arg: T | ((oldState: T) => T)) => {
      if (arg instanceof Function) {
        const newValue = arg(store.snapshot);
        store.mutate(newValue);
      } else {
        store.mutate(arg);
      }
    },
  ] as const;
};
