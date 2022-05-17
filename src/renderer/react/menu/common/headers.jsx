import './headers.scss';
import React, { useState, useRef } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

const Header = ( { children, name } ) => {
  return (
    <div className='header'>
      <span className="header__title">{name}</span>
      <span className="fillEmpty"/>
      {children}
    </div>
  )
}

const SetHeader = ( { children, name, onClick, button = 'New', buttonRef } ) => {
  const ref = useRef();
  const [ overflowed, setOverflowed ] = useState( false );

  useResizeObserver( ref, ( entry ) => {
    let x = entry.target.scrollWidth > entry.target.clientWidth;
    if ( overflowed != x ) setOverflowed( x );
  } )

  const style = overflowed ? { visibility: 'hidden' } : {};

  return (
    <Header name={name}>
      <span className="header__summary" ref={ref} style={style}>
        {children}
      </span>
      {onClick ? <button onClick={onClick} ref={buttonRef} className="button">{button}</button> : false}
    </Header>
  )
}

export { Header, SetHeader };
