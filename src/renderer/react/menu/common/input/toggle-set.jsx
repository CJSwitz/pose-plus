import './toggle-set.scss';
import React from 'react';

const ToggleSet = ( { labels, active, onChange, className } ) => {

  const items = labels.map( ( label, index ) => {
    let clazz = 'toggle__item';
    if (index == active) clazz += ' toggle__item--active';
    if (index == 0 ) clazz += ' toggle__item--left';
    if (index == labels.length - 1 ) clazz += ' toggle__item--right';

    const change = () => { if ( index != active ) onChange( index ); }
    return (
      <div className={clazz} onClick={change} key={label}>
        {label}
      </div>
    )
  } );

  let clazz = 'toggle';
  if (className) clazz += (' ' + className);

  return (
    <div className={clazz}>
      {items}
    </div>
  );
}

export {ToggleSet as default};
