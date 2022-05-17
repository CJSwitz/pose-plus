import React, { createContext, useContext } from 'react';
import RootStore from 'LIB/stores/root-store.js';

const RootContext = createContext();

export function RootProvider( { children } ) {
  return ( <RootContext.Provider value={new RootStore()}>
  {children}</RootContext.Provider> );
}

export function useStore() {
  const context = useContext(RootContext);
  if (context === undefined) throw new Error(`Cannot access root store outside of RootProvider`);
  return context;
}

export function useUiState() {
  return useStore().uiStore;
}

export function usePrefs() {
  return useStore().prefStore;
}

export function useSources() {
  return useStore().srcStore;
}

export function useCollections() {
  return useStore().colStore;
}
