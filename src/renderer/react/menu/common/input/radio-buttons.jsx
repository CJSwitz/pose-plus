import './radio-buttons.scss';
import React from 'react';

const RadioButton = ( { checked, label, onClick } ) => {

  function modClass( cls ) {
    if ( checked ) return cls + ' ' + cls + '--checked';
    else return cls;
  }

  const labelElem = label ? <span className={modClass('radio__label')} title={label}>{label}</span> : false;

  return (
    <div className="radio" onClick={onClick}>
      <span className={modClass("radio__button")}/>
      {labelElem}
    </div>
  )
}

const RadioSet = ( { labels, active, onChange } ) => {
  const buttons = labels.map( ( label, idx ) => {
    const click = () => { if ( idx != active ) onChange( idx ) };
    return <RadioButton key={idx} label={label} checked={idx == active} onClick={click}/>
  } );

  return <span className='radio-set'>{buttons}</span>;
}


export { RadioButton, RadioSet }
