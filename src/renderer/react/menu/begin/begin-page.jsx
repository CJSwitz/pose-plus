import './begin-page.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { unitToMs, msToString } from 'LIB/time.js';

import PlayIcon from 'SVG/google/play_circle_fill.svg';
import ClockIcon from 'SVG/google/clock.svg';
import ImageIcon from 'SVG/google/image.svg';

import { useStore } from '../../store-hooks.jsx';
import { Header } from '../common/headers.jsx';

import TimeSetup from './time-setup.jsx';
import ImageSetup from './image-setup.jsx';

import Switch from '../common/input/switch.jsx';
import Checkbox from '../common/input/checkbox.jsx';

const BeginPage = observer( ( props ) => {
  const { prefStore, uiStore } = useStore();
  const { session } = prefStore;

  let error = false;
  if ( !session.validTimer ) error = 'Invalid Timer';
  else if ( session.imageCount <= 0 ) error = 'No images selected.';

  const modClass = ( clazz ) => error ? clazz + ' ' + clazz + '--disabled' : clazz;
  const summaryInfo = ( () => {
    let clazz = "summary__info"
    let content;

    let time = false;
    if ( session.timer.mode == 2 ) {
      time = msToString(
        session.timer.advanced
        .map( v => v.images * unitToMs( v.time, v.unit ) )
        .reduce( ( a, c ) => a + c, 0 )
      )
    }

    if ( error ) {
      clazz += ' ' + clazz + '--error';
      content = error;
    } else {
      content = (
        <React.Fragment>
            <span className="summary__span">{session.imageCount}<ImageIcon className="summary__icon"/></span>
            {time ? <span className="summary__span">{time}<ClockIcon className="summary__icon"/></span> : false}
          </React.Fragment>
      )
    }

    return <div className={clazz}>{content}</div>;
  } )();

  const shuffleControl = (() => {
    const {shuffle} = session;
    return (
      <div className="summary__shuffle" onClick={() => session.updateShuffle(!shuffle)}>
        Shuffle
        <Switch on={shuffle}/>
      </div>
    )
  })();

  return (
    <div className="page">
        <Header name="Begin"/>
        <div className="seperator"/>
          <div className="begin-content">
            <TimeSetup />
            <div className="seperator"/>
            <ImageSetup />
          </div>
          <div className="summary">
          {summaryInfo}
          {shuffleControl}
          <button className={modClass("start-button")} disabled={error} onClick={() => uiStore.setView('player')}>
            <PlayIcon className={modClass('start-button__icon')}/>Start
          </button>
        </div>
    </div>
  )

} );

export { BeginPage as default };
