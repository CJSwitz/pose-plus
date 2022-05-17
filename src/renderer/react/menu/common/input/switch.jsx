import './switch.scss';
import React from 'react';

const Switch = ( { on, onChange } ) => {
  function getClass(base) {
    if (on) return base + ' ' + base + '--on';
    else return base;
  }

  return (
    <span className='switch' onClick={() => onChange && onChange(!on)}>
      <span className={getClass('switch__track')}/>
      <span className={getClass('switch__thumb')}/>
    </span>
  )
}

export { Switch as default };
