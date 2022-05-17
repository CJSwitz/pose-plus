import './canvas.scss';
import React, { useState, useEffect, useRef } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

import { calcBounds } from 'LIB/render/math.js';
import Vector from 'LIB/render/vector.js';

function resizeCanvas( canvas ) {
  const { width, height } = canvas.getBoundingClientRect();
  if ( canvas.width !== width || canvas.height !== height ) {
    const { devicePixelRatio: ratio = 1 } = window
    const context = canvas.getContext( '2d' );
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale( ratio, ratio );
  }
}

function render( canvas, image, offset, scale, box ) {
  if ( !image.complete ) return;

  const ctx = canvas.getContext( '2d' );
  const cv = new Vector( canvas.width, canvas.height );

  ctx.save();
  ctx.clearRect( 0, 0, cv.x, cv.y );
  ctx.drawImage( image, ...calcBounds( offset, scale, cv ) );
  ctx.restore();

  if ( box ) {
    const [ pos, size ] = box;

    ctx.save();

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 1;

    ctx.save();

    ctx.beginPath();
    ctx.rect( pos.x, pos.y, size.x, size.y );
    ctx.rect(0,0,cv.x, cv.y);
    ctx.clip('evenodd');
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.rect( pos.x, pos.y, size.x, size.y );
    ctx.stroke();

    ctx.restore();
  }

}

const Canvas = ( { image, offset, scale, box, handlers = {}, style } ) => {
  const { onResize, onMouseDown, onMouseUp, onMouseMove, onWheel } = handlers;
  const ref = useRef();
  const [ decoded, setDecoded ] = useState( false );


  // Draw Events
  const draw = () => render( ref.current, image, offset, scale, box );
  useEffect( draw, [ offset, scale, decoded, box ] );

  useEffect( () => {
    if ( !image.complete ) {
      setDecoded( false );
      image.decode().then( () => {
        setDecoded( true );
      } ).catch((ignored) => false);
    }
  }, [ image ] );

  // Resize Events
  useResizeObserver( ref, ( en ) => {
    resizeCanvas( ref.current );
    const { width: x, height: y } = en.contentRect;
    draw(); // Neccesary to invoke immediately to prevent flashing
    if ( onResize ) onResize( new Vector( x, y ) );
  } );

  return (
    <canvas ref={ref} className="canvas" onMouseDown={onMouseDown} style={style}
      onMouseUp={onMouseUp} onMouseMove={onMouseMove} onWheel={onWheel} />
  )
}

export { Canvas as default };
