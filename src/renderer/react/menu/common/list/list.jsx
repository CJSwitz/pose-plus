import React, { useRef } from 'react';

const List = ( { onClick, children, addClass } ) => {
  let clazz = "list";
  if (addClass) clazz += ' ' + addClass;
  const ref = useRef();

  // Only invoke on direct click
  function handler( e ) {
    if ( onClick && e.target == ref.current ) onClick( e );
  }

  return (
    <div className={clazz} onClick={handler} ref={ref}>
      {children}
    </div>
  )
}

export { List };
