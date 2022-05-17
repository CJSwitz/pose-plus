import './flyout.scss';
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import CheckIcon from 'SVG/google/checkmark.svg';

import { useStore } from '../../store-hooks.jsx';

const ITEM_CLASS = 'flyout__item';
const LEAVE_DELAY = 700;

function Item( { onClick, children, modifiers = [], disabled } ) {
  let clazz = ITEM_CLASS;
  const mod = disabled ? modifiers.concat( 'disabled' ) : modifiers;
  mod.forEach( m => clazz += ' ' + ITEM_CLASS + '--' + m );

  const click = ( ev ) => { if ( !disabled ) onClick( ev ) };

  return (
    <div className={clazz} onClick={click}>
      {children}
    </div>
  )
}

function ToggleItem( { value, onChange, children, disabled } ) {
  let mod = [ 'toggle' ];
  let clazz = 'flyout__check';

  if ( !value ) {
    clazz += ' ' + clazz + '--off';
    mod.push( 'off' );
  }

  return (
    <Item modifiers={mod} onClick={() => onChange(!value)} disabled={disabled}>
      <CheckIcon className={clazz}/>
      {children}
    </Item>
  )
}

const Flyout = observer( ( { className, onLeave, entry, session } ) => {
  const { prefStore, uiStore } = useStore();
  const [ leaveTimer, setLeaveTimer ] = useState( null );

  function onMouseEnter( ev ) {
    setLeaveTimer( id => {
      if ( id ) clearTimeout( id );
      return null;
    } );
  }

  function onMouseLeave( ev ) {
    setLeaveTimer( id => {
      if ( id ) clearTimeout( id );
      return setTimeout( () => onLeave(), LEAVE_DELAY );
    } )
  }

  function onShowFolder() {
    const { path } = session.images.currentInfo;
    ipc.send('show-in-folder', path);
  }

  let clazz = 'flyout';
  if ( className ) clazz += ' ' + className;

  return (
    <div className={clazz} onMouseOver={onMouseEnter} onMouseOut={onMouseLeave}>
      <ToggleItem value={prefStore.prefs.dockTimer} onChange={(v) => prefStore.set('dockTimer', v)} disabled={!session.timer}>Dock Timer</ToggleItem>
      <ToggleItem value={prefStore.prefs.dockControls} onChange={(v) => prefStore.set('dockControls', v)}>Dock Controls</ToggleItem>
      <div className='flyout__divider'/>
      <Item onClick={() => uiStore.setZoomActual(true)}>Zoom Actual Pixels</Item>
      <Item onClick={onShowFolder}>Show in Folder</Item>
    </div>
  )
} );

export { Flyout as default };
