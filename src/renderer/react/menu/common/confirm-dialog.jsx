import './confirm-dialog.scss';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { useUiState } from '../../store-hooks.jsx';
import Checkbox from './input/checkbox.jsx';

Modal.setAppElement( '#root' );

function getClass( str ) {
  return {
    base: str,
    afterOpen: str + '--open',
    beforeClose: str + '--close'
  }
}

function ConfirmDialog( { show, header, children, onConfirm, onClose } ) {
  const store = useUiState();
  const [ dontAsk, setDontAsk ] = useState( false );
  const toggle = () => setDontAsk( !dontAsk );

  const confirm = () => {
    if ( dontAsk ) store.setConfirm( false );
    onConfirm();
    onClose();
  }

  return (
    <Modal className={getClass('confirm-dialog__content')}  overlayClassName={getClass('confirm-dialog')}
      isOpen={show} onRequestClose={onClose} closeTimeoutMS={400}>
        <div className='confirm-dialog__header'>
          {header}
        </div>
        <div className='confirm-dialog__message'>
          {children}
        </div>
      <div className='confirm-dialog__controls'>
        <span className='confirm-dialog__noask' onClick={toggle}>
          <Checkbox checked={dontAsk} onClick={toggle}/>
          &nbsp;Don't ask again this session
        </span>
        <span className='confirm-dialog__actions'>
          <button className='confirm-dialog__button confirm-dialog__button--cancel' onClick={onClose}>Cancel</button>
          <button className='confirm-dialog__button confirm-dialog__button--delete' onClick={confirm}>Delete</button>
        </span>
      </div>
    </Modal>
  )
}

export { ConfirmDialog as default }
