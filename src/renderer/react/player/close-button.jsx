import './close-button.scss';
import React from 'react';
import { observer } from 'mobx-react-lite';

import CloseIcon from 'SVG/custom/close_custom.svg';
import { useStore } from '../store-hooks.jsx';

const CloseButton = observer( ( { show, invisible, onClose } ) => {
  const { uiStore } = useStore();

  let clazz = 'close-button';
  if ( show ) clazz += ' ' + clazz + '--fadein';
  else clazz += ' ' + clazz + '--fadeout';
  if ( uiStore.cropMode ) clazz += ' vanish';

  return <CloseIcon className={clazz} onClick={onClose}/>
} );

export { CloseButton as default }
