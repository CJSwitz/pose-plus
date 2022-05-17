import './play-button.scss';
import React from 'react';
import {CSSTransition, SwitchTransition} from 'react-transition-group';

import PlayIcon from 'SVG/google/play.svg';
import PauseIcon from 'SVG/google/pause.svg';
import FastForwardIcon from 'SVG/google/fast_forward.svg';

const PlayButton = ( { value, fastforward, onChange, className } ) => {
  let clazz = 'play-button';
  if (className) clazz += ' ' + className;

  const icon = (() => {
    if (fastforward) return <FastForwardIcon className='play-button__icon'/>
    else if (value) return <PlayIcon className='play-button__icon'/>
    else return <PauseIcon className='play-button__icon'/>
  })()

  return (
    <div className={clazz} onClick={() => onChange(!value)}>
      <SwitchTransition>
        <CSSTransition key={value} classNames='play-button__icon-' timeout={100}>
          {icon}
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

export { PlayButton as default };

/*
 The idea behind 'fastforward' was for advanced mode. If you navigated backwards,
 it would remember where you last were and pause the timer, chaning the play to
 a fast forward icon. If you clicked it, it would skip you back to the lastest image
 and resume the timer. Don't know if its a terribly useful feature, though.
*/
