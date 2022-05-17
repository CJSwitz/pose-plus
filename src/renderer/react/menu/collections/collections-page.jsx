import React, { useReducer, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import CollectionIcon from 'SVG/google/collections.svg';
import DeleteIcon from 'SVG/google/delete_fill.svg';

import { useCollections, useUiState } from '../../store-hooks.jsx';

import EditPage from './edit-page.jsx';
import Expander from '../common/expander.jsx';
import Tooltip from '../../tooltip.jsx';
import ConfirmDialog from '../common/confirm-dialog.jsx';
import { ExpandingList } from '../common/list';
import { SetHeader } from '../common/headers.jsx';

function reducer( state, action ) {
  switch ( action.type ) {
    case 'select':
      return { select: action.collection, expandList: true };
    case 'new':
      return { expandNew: true };
    case 'close':
      return { select: state.select };
    default:
      return state;
  }
}

function modalReducer( state, action ) {
  if ( action.type == 'close' ) return { ...state, show: false };
  else if ( action.type == 'show' ) {
    const { callback, message } = action;
    return { callback, message, show: true };
  } else return state;
}

const CollectionsPage = observer( () => {
  const store = useCollections();
  const uiState = useUiState();
  const btnRef = useRef();
  const [ state, dispatch ] = useReducer( reducer, {} );
  const [ modal, modalDispatch ] = useReducer( modalReducer, { show: false } );

  const onDelete = ( collection, callback ) => {
    const del = () => {
      store.remove( collection.id );
      if ( callback ) callback();
    }

    if ( !uiState.confirm ) del()
    else {
      modalDispatch( {
        type: 'show',
        message: collection.id,
        callback: del
      } );
    }
  }

  const getControls = ( collection ) => {
    return (
      <Tooltip content="Delete" delay={[300,0]}>
        <DeleteIcon className="list__control" onClick={(e) => {
          e.stopPropagation();
          onDelete(collection);
        }}/>
      </Tooltip>
    )
  }

  const editPg = <EditPage collection={store.getCollection(state && state.select)} onBack={() => dispatch({type:'close'})} onDelete={onDelete}/>

  return (
    <div className='page'>
      <SetHeader name="Collections" onClick={() => dispatch({type:'new'})} buttonRef={btnRef}>
        <span>{store.collections.length}</span>
        <CollectionIcon className="header__icon"/>
      </SetHeader>
      <ExpandingList store={store} onSelect={(v) => dispatch({type:'select', collection: v})} expand={state.expandList} controls={getControls}>
        {editPg}
      </ExpandingList>
      <Expander from={btnRef} expand={state.expandNew} overlay={editPg}/>
      <ConfirmDialog show={modal.show} header='Delete Collection?' onClose={() => modalDispatch({type: 'close'})} onConfirm={modal.callback}>
        {modal.message}
      </ConfirmDialog>
    </div>
  )
} );

export { CollectionsPage as default };
