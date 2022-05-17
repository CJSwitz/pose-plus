import './player-controls.scss';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { CSSTransition } from 'react-transition-group';

import CropIcon from 'SVG/google/crop.svg';
import ShuffleIcon from 'SVG/google/shuffle.svg';
import ZoomSquareIcon from 'SVG/google/zoom_square.svg';
import MoreIcon from 'SVG/google/more_horiz.svg';
import InfoIcon from 'SVG/google/info.svg';
import AutoCropIcon from 'SVG/custom/crop_auto.svg';
import NextIcon from 'SVG/custom/nav_next_16p.svg';
import PrevIcon from 'SVG/custom/nav_prev_16p.svg';


import PlayButton from './play-button.jsx';
import Tooltip from '../../tooltip.jsx';
import { useStore } from '../../store-hooks.jsx';
import Flyout from './flyout.jsx';
import InfoModal from './info-modal.jsx';

const IconButton = ( { Icon, tooltip, inactive, disabled, onClick } ) => {
  let clazz = 'plcont__icon';
  if ( inactive ) clazz += ' ' + clazz + '--inactive';

  const click = ( ev ) => {
    if ( !disabled && onClick ) onClick( ev );
  }

  return (
    <Tooltip theme='player' content={tooltip} delay={[400, 0]}>
      <Icon className={clazz} onClick={click}/>
    </Tooltip>
  )
}

const PlayerControls = observer( ( { session, show } ) => {
  const { uiStore, prefStore, srcStore } = useStore();
  const info = session.images.currentInfo;
  const source = srcStore.getSource( info.source );
  const entry = source.getEntry( info.name );

  const [ flyout, setFlyout ] = useState( false );
  const [ infoModal, setInfoModal ] = useState( 0 ); // 0: off, 1: on but already paused, 2: on, and should unpause

  // Esc Key Handler
  const onEscapeKey = ( ev ) => {
    if ( ev.code == 'Escape' ) uiStore.setCropMode( false );
  }

  useEffect( () => {
    if ( uiStore.cropMode ) {
      document.addEventListener( 'keyup', onEscapeKey );
      return () => document.removeEventListener( 'keyup', onEscapeKey );
    } else document.removeEventListener( 'keyup', onEscapeKey );
  }, [ uiStore.cropMode ] )

  // Arrow Key Handlers

  useEffect( () => {
    const listener = ( ev ) => {
      if ( ev.code == 'ArrowRight' ) session.next();
      else if ( ev.code == 'ArrowLeft' ) session.prev();
    }

    document.addEventListener( 'keyup', listener );
    return () => document.removeEventListener( 'keyup', listener );
  }, [ session ] );

  // Click Handlers
  const onDefineCrop = () => {
    entry.setMode( 'full' );
    uiStore.setCropMode( true );
  }

  // Info Modal Handlers

  const showInfoModal = () => {
    if (session.timer && !session.timer.paused) {
      setInfoModal(2);
      session.timer.togglePause();
    } else setInfoModal(1);
  }

  const hideInfoModal = () => {
    if (infoModal == 2) session.timer.togglePause();
    setInfoModal(0);
  }

  const playBtn = ( () => {
    if ( session.timer ) {

      return (
        <div className='plcont__spacer'>
          <PlayButton className='plcont__play' value={session.timer.paused} onChange={session.timer.togglePause}/>
        </div>
      )
    } else return false;
  } )();

  let clazz = 'plcont';
  if ( show ) clazz += ' plcont--fadein';
  else clazz += ' plcont--fadeout';
  if ( prefStore.prefs.dockControls ) clazz += ' plcont--docked';
  if ( uiStore.cropMode ) clazz += ' vanish';


  return (
    <div className={clazz}>
      <IconButton Icon={ZoomSquareIcon} tooltip='Show Full Image' inactive={entry && entry.mode != 'full'} onClick={()=> entry.setMode('full')}/>
      <IconButton Icon={AutoCropIcon} tooltip='Auto Zoom' inactive={entry && entry.mode != 'auto'} onClick={() => entry.setMode('auto')} disabled={!entry}/>
      <IconButton Icon={CropIcon} tooltip='Define Auto Zoom' onClick={onDefineCrop}/>
      <PrevIcon className='plcont__icon plcont__icon--nav' onClick={() => session.prev()}/>
      {playBtn}
      <NextIcon className='plcont__icon plcont__icon--nav' onClick={() => session.next()}/>
      <IconButton Icon={ShuffleIcon} tooltip='Toggle Shuffle' inactive={!session.images.shuffle} onClick={()=> session.images.toggleShuffle()}/>
      <IconButton Icon={InfoIcon} tooltip='Show Info' onClick={showInfoModal}/>
      <div className='plcont__anchor'>
        <IconButton Icon={MoreIcon} tooltip='More' onClick={() => setFlyout(!flyout)}/>
        <CSSTransition in={flyout} timeout={{enter: 500, exit:200}} classNames='flyout-' mountOnEnter={true} unmountOnExit={true}>
          <Flyout className='plcont__flyout' onLeave={() => setFlyout(false)} entry={entry} session={session}/>
        </CSSTransition>
      </div>
      <InfoModal show={!!infoModal} session={session} onClose={hideInfoModal}/>
    </div>
  )
} );


export { PlayerControls as default };
