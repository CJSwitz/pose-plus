// Root Component
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { observer } from 'mobx-react-lite';

import { RootProvider, useStore } from './store-hooks.jsx';

import MenuView from './menu/menu-view.jsx';
import PlayerView from './player/player-view.jsx';
import TestView from './test/test-view.jsx';
import LoadingView from './loading-view.jsx';

const App = observer( () => {
  const [ ready, setReady ] = useState( false );
  const { uiStore, prefStore, colStore, srcStore } = useStore();

  if ( !ready && prefStore.ready && colStore.ready && srcStore.ready ) setReady( true );

  if ( !ready ) return <LoadingView/>
  else if ( uiStore.view == 'menu' ) return <MenuView/>
  else if ( uiStore.view == 'test' ) return <TestView/>
  else return <PlayerView/>
} )

const root = createRoot(document.getElementById( 'root' ))
root.render( <RootProvider><App/></RootProvider> );
