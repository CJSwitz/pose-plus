import React from 'react';
import TimePicker from './time-picker.jsx';

const SimpleTimer = ( { onChange, time, error } ) => {
  return (
    <React.Fragment>
        <div className="time-setup__row">
          <span>For All Images:&nbsp;</span>
          <TimePicker onChange={onChange} value={time} error={error}/>
        </div>
    </React.Fragment>
  )
}

export {SimpleTimer as default};
