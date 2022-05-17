import './nav.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

// Icons
import IconPlay from 'SVG/google/play_circle_fill.svg';
import IconFolder from 'SVG/google/folder_fill.svg';
import IconSettings from 'SVG/google/settings_fill.svg';
import IconCollections from 'SVG/google/collections_fill.svg';

import TextLogo from 'SVG/custom/TextLogo.svg';

import { useUiState } from '../store-hooks.jsx';

const NavItem = ( { children, selected, onClick } ) => {

  let clazz = "nav__item";
  if ( selected ) clazz += " nav__item--selected";

  return (
    <div className={clazz} onClick={onClick}>
      {children}
    </div>
  )
}

const NavRail = observer( () => {
  const { page, setPage } = useUiState();

  return (
    <div className="nav">
      <div className="nav__section">
        <TextLogo className="nav__header"/>
        <div className="fillEmpty"/>
      </div>
      <div className="nav__section">
        <NavItem selected={page == 'begin'} onClick={() => setPage('begin')}>
          <IconPlay className='nav__icon'/>
          <span className='nav__label'>Begin</span>
        </NavItem>
        <NavItem  selected={page == 'sources'} onClick={() => setPage('sources')}>
          <IconFolder className='nav__icon'/>
          <span className='nav__label'>Sources</span>
        </NavItem>
        <NavItem  selected={page == 'collections'} onClick={() => setPage('collections')}>
          <IconCollections className='nav__icon'/>
          <span className='nav__label'>Collections</span>
        </NavItem>
        <NavItem  selected={page == 'settings'} onClick={() => setPage('settings')}>
          <IconSettings className='nav__icon'/>
          <span className='nav__label'>Settings</span>
        </NavItem>
      </div>
      <div className="nav__section">
        <div className="fillEmpty"/>
        <div className="nav__footer">Version {util.VERSION}</div>
      </div>
    </div>
  );
} );

export { NavRail, NavItem };
