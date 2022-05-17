import './info-modal.scss';
import React from 'react';
import { observer } from 'mobx-react-lite';
import Modal from 'react-modal';

import CloseIcon from 'SVG/custom/close_custom.svg';

import { useStore } from '../../store-hooks.jsx';
import BreakingPath from '../../breaking-path.jsx';

Modal.setAppElement( '#root' );
const CLS = 'info-modal';

function getClass( str ) {
  return { base: str, afterOpen: str + '--open', beforeClose: str + '--close' }
}

const InfoModal = observer( ( { show, session, onClose } ) => {
  const { srcStore } = useStore();
  const info = session.images.getCurrent();

  const source = srcStore.getSource( info.source );

  const srcName = ( () => {
    const clazz = CLS + '__value';
    if ( source.label ) return <span className={clazz}>{source.label}</span>
    else return <span className={clazz + ' ' + clazz + '--trunc'}>{source.path}</span>
  } )()

  const curRes = `${info.image.naturalWidth} x ${info.image.naturalHeight} pixels`;

  const completionInfo = (()=>{
    if (!session.timer) return false;
    const {sessionLength: sl, totalImages: ti} = session;
    const str = sl ? `${ti} of ${sl} images` : `${ti} ${ti == 1 ? 'image' : 'images'}`;

    return (
      <div className={CLS + '__row'}>
        <span className={CLS + '__key'}>Completed:&nbsp;</span>
        <span className={CLS + '__value'}>{str}</span>
      </div>
    )
  })()

  return (
    <Modal className={getClass(CLS + '__content')} overlayClassName={getClass(CLS)}
      isOpen={show} onRequestClose={onClose} closeTimeoutMS={400}>
      <CloseIcon className={CLS + '__close'} onClick={onClose}/>
      <div className={CLS + '__header'}>Session Info</div>
      <div className={CLS + '__body'}>
        <div className={CLS + '__row'}>
          <span className={CLS + '__key'}>Current Image:&nbsp;</span>
          <span className={CLS + '__value'}>{info.name}</span>
        </div>
        <div className={CLS + '__row'}>
          <span className={CLS + '__key'}>Source:&nbsp;</span>
          {srcName}
        </div>
        <div className={CLS + '__row'}>
          <span className={CLS + '__key'}>Resolution:&nbsp;</span>
          <span className={CLS + '__value'}>{curRes}</span>
        </div>
        {completionInfo}
      </div>
    </Modal>
  )
} );

export { InfoModal as default }
// <div className={CLS + '__row'}></div>
