import React, { useState, useEffect, useReducer } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../store-hooks.jsx';
import Canvas from './canvas.jsx';

import Vector, { V0, V1 } from 'LIB/render/vector.js';
import { calcFromRect, rectFromPoints } from 'LIB/render/math.js';

import ImageMetadata from 'LIB/stores/image-metadata.js';

import calcBG from 'LIB/render/calc-bg.js';

const ZOOM_SENSITIVITY = 0.0015;
const MIN_DRAG = 20;

function reducer( state, action ) {
  switch ( action.type ) {
    case 'stop':
      return false;
    case 'start':
      return { mode: action.mode, start: action.start };
    case 'box':
      return { ...state, box: action.box };
  }
}

const PlayerImage = observer( ( { current, changeBG } ) => {
  const { image, ...info } = current;
  const { srcStore, prefStore, uiStore } = useStore();

  // Drag State
  const [ state, dispatch ] = useReducer( reducer, false );

  // Size Vectors
  const [ cv, setCV ] = useState( V1 );
  const [ iv, setIV ] = useState( V1 );

  useEffect( () => {
    image.decode().then( () => setIV( new Vector( image.naturalWidth, image.naturalHeight ) ), ( ignored ) => false );
  }, [ image ] )

  // Get saved position info from source
  const source = srcStore.getSource( info.source );
  const entry = source.getEntry( info.name );


  // Compute offset P and scale G
  const [ offset, scale ] = ( () => {
    if ( !entry || entry.mode == 'full' ) {
      return calcFromRect( V0, iv, cv );
    } else if ( entry.mode == 'auto' ) {
      return calcFromRect( entry.auto.pos, entry.auto.size, cv );
    } else {
      return [ entry.manual.offset, entry.manual.scale ];
    }
  } )();

  if ( !entry ) source.addEntry( new ImageMetadata( info.name, 'full', { offset: V0, scale }, { pos: V0, size: iv } ) );


  // Auto Background Color
  useEffect( () => {
    if ( entry && prefStore.prefs.autoBG ) {
      if ( entry.bg ) changeBG( entry.bg );
      else {
        // Measure automatic background color
        image.decode().then( () => {
          const bg = calcBG( image );
          changeBG( bg );
          entry.setBG( bg );
        }, ( ignored ) => false );
      }
    }
  }, [ entry, image ] );


  // Vector Maths
  function getMPos( ev ) {
    const rect = ev.target.getBoundingClientRect();
    return new Vector( ev.clientX - rect.left, ev.clientY - rect.top );
  }

  function clampToImage( v ) {
    const ip = v.scale( scale ).add( offset );
    const x = Math.max( Math.min( ip.x, iv.x ), 0 );
    const y = Math.max( Math.min( ip.y, iv.y ), 0 );
    return new Vector( x, y ).sub( offset ).scale( 1 / scale );
  }

  // Handle Crop Mode Cancellation
  useEffect( () => {
    if ( state && state.mode == 'crop' && !uiStore.cropMode ) dispatch( { type: 'stop' } );
  }, [ uiStore.cropMode ] )

  // Handle zoom to actual Pixels
  useEffect(() => {
    if (uiStore.zoomActual) {

      const center = cv.scale(scale * 0.5).add(offset);
      const delta = 1 / scale;
      const diff = offset.sub(center).scale(delta);

      entry.setManual(diff.add(center), 1);
      uiStore.setZoomActual(false);
    }
  },[uiStore.zoomActual])


  // Event Handlers
  function onWheel( ev ) {
    if ( !entry || uiStore.cropMode ) return;

    let delta = ev.deltaY * scale * ZOOM_SENSITIVITY;
    if ( scale + delta < 0 ) return;
    entry.setManual( offset.sub( getMPos( ev ).scale( delta ) ), scale + delta );
  }

  function onMouseDown( ev ) {
    if ( ev.button == 0 ) {
      if ( uiStore.cropMode ) {
        dispatch( { type: 'start', mode: 'crop', start: clampToImage( getMPos( ev ) ) } );
      } else {
        dispatch( { type: 'start', mode: 'pan' } )
      }
    }
  }

  function onMouseUp( ev ) {
    if ( !state ) return;
    if ( ev.button == 0 ) {
      if ( state.mode == 'crop' ) {
        uiStore.setCropMode( false );

        const mpos = clampToImage( getMPos( ev ) );
        const delta = state.start.sub( mpos );

        if ( Math.abs( delta.x ) > MIN_DRAG && Math.abs( delta.y ) > MIN_DRAG ) {
          let [ pos, size ] = rectFromPoints(
            state.start.scale( scale ).add( offset ),
            mpos.scale( scale ).add( offset )
          )

          entry.setAuto( pos, size );
        }
      }

      dispatch( { type: 'stop' } );
    }
  }

  function onMouseMove( ev ) {
    if ( !state ) return;
    else if ( state.mode == 'pan' ) {
      const ne = ev.nativeEvent;
      const delta = new Vector( ne.movementX, ne.movementY );
      entry.setManual( offset.sub( delta.scale( scale ) ), scale );
    } else {
      dispatch( {
        type: 'box',
        box: rectFromPoints( state.start, clampToImage( getMPos( ev ) ) )
      } )
    }
  }

  const handlers = { onResize: setCV, onWheel, onMouseDown, onMouseUp, onMouseMove };

  const style = uiStore.cropMode ? { cursor: 'crosshair' } : undefined;

  return (
    <Canvas image={image} offset={offset} scale={scale} handlers={handlers} changeBG={changeBG} box={state.box} style={style}/>
  )
} );

export { PlayerImage as default };
