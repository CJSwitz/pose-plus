import './time-picker.scss';
import React from 'react';

import { RadioSet } from '../../common/input/radio-buttons.jsx';
import NumberField from './numberfield.jsx';

const TIME_UNITS = [ 'Seconds', 'Minutes' ];

const TimePicker = ( { value, onChange, error } ) => {
  const { time, unit } = value;
  return (
    <span className='time-picker'>
      <NumberField value={time} onChange={(v) => onChange({time: v, unit})} error={error} max={9999}/>
      <RadioSet labels={TIME_UNITS} active={unit} onChange={(v) => onChange({time, unit: v})}/>
    </span>
  )
}

export { TimePicker as default };
