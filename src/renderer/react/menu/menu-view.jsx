// This is the root view component for the menu view
import React from 'react';
import { observer } from 'mobx-react-lite';

import { useUiState } from '../store-hooks.jsx';

import { NavRail } from './nav.jsx';
import BeginPage from './begin/begin-page.jsx';
import SourcesPage from './sources/sources-page.jsx';
import CollectionsPage from './collections/collections-page.jsx';
import SettingsPage from './settings/settings-page.jsx';

const MenuView = observer( () => {
  const page = useUiState().page;
  const pageElem = ( () => {
    switch ( page ) {
      case 'begin':
        return <BeginPage/>
      case 'sources':
        return <SourcesPage/>
      case 'collections':
        return <CollectionsPage/>
      case 'settings':
        return <SettingsPage/>
    }
  } )()

  return (
    <div className="view">
      <NavRail/>
      {pageElem}
    </div>
  );
} );

export default MenuView;
