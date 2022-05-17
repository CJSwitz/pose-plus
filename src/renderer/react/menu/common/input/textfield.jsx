import './textfield.scss';
import React, { useState, useEffect } from 'react';

const TextField = ( { onInput, value, label, readOnly, number } ) => {
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(value);

  const type = number ? 'number' : 'text';

  useEffect(() => {
    setActive(value);
  },[value])

  function onFocus() {
    setActive(true);
    setFocus(true);
  }

  function onBlur() {
    setFocus(false);
    setActive(value);
  }


  let con = 'textfield';
  let lbl = 'textfield__label';

  if (active) lbl += ' textfield__label--active';
  if (focus) {
    con += ' textfield--focus';
    lbl += ' textfield__label--focus';
  }

  function onChange(e) {
    let val = number ? e.target.valueAsNumber : e.target.value;
    onInput(val);
  }

  return (
    <label className={con} onFocus={onFocus} onBlur={onBlur}>
      <span className={lbl}>{label}</span>
      <input type={type} className="textfield__input" value={value} onChange={onChange} readOnly={readOnly}/>
    </label>
  )
}

export default TextField;
