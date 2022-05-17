import './player-view.scss';
import React, { useState, useEffect, useRef, useReducer } from 'react';
import { observer } from 'mobx-react-lite';

import Vector from 'LIB/render/vector.js';
import { useStore } from '../store-hooks.jsx';
import PlayerSession from 'LIB/state/player-session.js';

import PlayerImage from './image/player-image.jsx';
import PlayerControls from './controls/player-controls.jsx';
import Timer from './timer.jsx';
import CloseButton from './close-button.jsx';


const PlayerView = observer( () => {
  const {prefStore, uiStore} = useStore();
  const [ session, setSession ] = useState( null );
  const [ bgCol, setBgCol ] = useState( prefStore.prefs.bgCol );
  const [show, setShow] = useState(true);

  useEffect( () => {
    let { session: s } = prefStore;
    s.fileInfo.then( ( fileInfo ) => {
      setSession( new PlayerSession( fileInfo, s.shuffle, s.timeParams ) );
    } );
  }, [] );

  function onClose() {
    session.dispose();
    uiStore.setView('menu');
  }


  const loadingSplash = (
    <div className='loading-splash'>
      Loading
    </div>
  )

  const viewElems = ( () => {
    if ( session == null ) return false;
    else {
      return (
        <React.Fragment>
          <CloseButton show={show} onClose={onClose}/>
          {session.timer ? <Timer show={prefStore.prefs.dockTimer || show} session={session}/> : false}
          <PlayerImage current={session.images.getCurrent()} changeBG={(v) => setBgCol(v)}/>
          <PlayerControls session={session} show={prefStore.prefs.dockControls || show}/>
        </React.Fragment>
      )
    }
  } )()

  return (
    <div className='player-view' style={{ "backgroundColor": bgCol }}
      onMouseOver={() => setShow(true)} onMouseOut={() => setShow(false)}>
      {session == null ? loadingSplash : false }
      {viewElems}
    </div>
  )
} );

export { PlayerView as default }
