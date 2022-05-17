import './numberfield.scss';
import React from 'react';

const NumberField = ( { value, onChange, max, min = 0, error, integer } ) => {
  const val = Number.isNaN( value ) ? '' : value;

  function modClass(clazz) {
    let str = clazz;
    if ( error ) str += ' ' + clazz + '--error';
    if (max < 1000)  str += ' ' + clazz + '--short';
    return str;
  }

  function changeHandler(e) {
    let v = e.target.valueAsNumber;
    if (integer) v= Math.floor(v);
    if (v < min ) v = min;
    onChange(v > max ? max : v);
  }

  return (
    <input className={modClass("numberfield")} type="number" value={val}
      onChange={changeHandler}
      onFocus={(e) => e.target.select()}
    />
  )
}

export { NumberField as default };
