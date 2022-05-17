import React from 'react';

// This is meant to exactly match index.html for reactDOM.hydrate

const style = {
  width: '128px',
  height: '128px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}

export default function LoadingView() {
  return (
    <img src="res/Logo.svg" style={style}/>
  )
}
