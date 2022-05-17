import './checkbox.scss';
import React from 'react';

import { SwitchTransition, CSSTransition } from 'react-transition-group';

import BlankIcon from 'SVG/google/check_box_blank.svg';
import CheckedIcon from 'SVG/google/check_box_checked.svg';
import IndIcon from 'SVG/google/check_box_indeterminate.svg';

const Checkbox = ( { checked, indeterminate, onClick, className} ) => {

  let Icon;
  let state;

  if ( checked ) {
    Icon = CheckedIcon;
    state = 'checked';
  } else if ( indeterminate ) {
    Icon = IndIcon;
    state = 'indeterminate';
  } else {
    Icon = BlankIcon;
    state = 'blank';
  }

  function click() {
    if ( onClick ) {
      if ( checked ) onClick( false );
      else onClick( true );
    }
  }

  return (
    <SwitchTransition>
      <CSSTransition key={state} classNames='checkbox-' timeout={50}>
        <Icon className={className + ' checkbox checkbox--' + state} onClick={click}/>
      </CSSTransition>
    </SwitchTransition>
  )
}

export { Checkbox as default }
