import React from 'react';

import AddIcon from 'SVG/google/add_circle.svg';
import RemoveIcon from 'SVG/google/remove_circle.svg';

import TimePicker from './time-picker.jsx';
import NumberField from './numberfield.jsx';

const DEF_ROW = { images: 1, time: 1, unit: 1 }

const AdvancedTimer = ( { timers, onChange } ) => {

  function change( timer, images, index ) {
    let obj = { ...timer, images }
    let arr = timers.slice();
    arr[ index ] = obj;
    onChange( arr );
  }

  function remove(index) {
    if (timers.length > 1) {
      let arr = timers.filter((t, i) => i != index);
      onChange(arr);
    }
  }

  function add() {
    onChange(timers.concat(DEF_ROW));
  }


  const rowElems = timers.map( ( t, index ) => {
    const { images, ...timer } = t;
    return (
      <div className="time-setup__row" key={index}>
        <RemoveIcon className="time-setup__icon" onClick={() => remove(index)}/>
        <span>
          Images:&nbsp;
          <NumberField value={t.images} onChange={(v) => change(timer, v, index)} max={999} min={1} integer error={!t.images}/>
          &nbsp;Time:&nbsp;
        </span>
        <TimePicker onChange={(v) => change(v, images, index)} value={t} error={timer.time <= 0 || Number.isNaN(timer.time)}/>
      </div>
    )
  } )

  return (
    <React.Fragment>
      {rowElems}
      <div className="time-setup__row">
        <AddIcon className="time-setup__icon" onClick={add}/>
        <span className="fillEmpty"/>
      </div>
    </React.Fragment>
  )
}

export { AdvancedTimer as default };
