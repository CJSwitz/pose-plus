import './expander.scss';
import React, { useState, useEffect, useRef } from 'react';

// These must match transition timings in CSS
const IN_MS = 350;
const OUT_MS = 250;

function getClass( modifiers = [] ) {
  if ( modifiers.length == 0 ) {
    return 'expand__overlay'
  } else {
    return 'expand__overlay ' + modifiers.map( mod => 'expand__overlay--' + mod ).join( ' ' );
  }
}

const Expander = ( { children, from, expand, overlay } ) => {
  const ref = useRef();
  const [ state, setState ] = useState( 'unmounted' );
  const [ direction, setDirection ] = useState( 'in' );
  const [ pos, setPos ] = useState({left: 0, top: 0, bottom: 0, right: 0});

  useEffect(() => {
    let el = from.current;
    if (el) setPos({
      left: el.offsetLeft,
      top: el.offsetTop,
      right: el.offsetParent.clientWidth - el.clientWidth -  el.offsetLeft,
      bottom: el.offsetParent.clientHeight - el.clientHeight - el.offsetTop,
    });

  }, [from.current]);

  // State Transitions
  // Direction In: Unmounted -> Hidden -> Entering -> Shown
  // Direction Out: Shown -> Exiting -> Hidden -> Unmounted

  useEffect( () => {
    if ( expand ) {
      // Should Expand
      if ( direction != 'in' ) setDirection( 'in' );

      if ( state == 'unmounted' ) {
        setState( 'hidden' );
      } else if ( state == 'hidden' ) {
        // This forces react to update DOM with "hidden" style
        ref.current && ref.current.scrollTop;
        setState( 'entering' );
        setTimeout( () => setState( 'shown' ), IN_MS );
      }
    } else {
      // Should Collapse
      if ( direction != 'out' ) setDirection( 'out' );

      if ( state == 'shown' ) {
        setState( 'exiting' );
      } else if ( state == 'exiting' ) {
        setState( 'hidden' );
        setTimeout( () => setState( 'unmounted' ), OUT_MS );
      }
    }
  }, [ state, direction, expand ] );

  const overlayElem = ( () => {
    if ( state == 'unmounted' ) return false;

    // Styles
    const showStyle = { top: 0, left: 0, bottom: 0, right: 0, opacity: 1}
    const hideStyle = { ...pos, opacity: 0}


    // Setup classNames
    const modifiers = [ direction ]; // --in or --out
    if ( state == 'entering' || state == 'exiting' ) modifiers.push( 'animating' ); // --animating
    const className = getClass( modifiers );

    // Element
    if ( state == 'hidden' || state == 'exiting' ) {
      return (

        <div className={className} ref={ref} style={hideStyle}>
          <div className={`expand__content expand__content--${direction} expand__content--hidden`}>
            {overlay}
          </div>
        </div>
      )
    } else {
      return (
        <div className={className} ref={ref} style={showStyle}>
          <div className={`expand__content expand__content--${direction}`}>
            {overlay}
          </div>
        </div>
      )

    }
  } )();

  return (
    <React.Fragment>
        {children}
        {overlayElem}
    </React.Fragment>
  )
};

export default Expander;
