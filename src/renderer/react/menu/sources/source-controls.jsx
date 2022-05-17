import React, { useEffect, useReducer } from 'react';
import { observer } from 'mobx-react-lite';
import { useSources } from '../../store-hooks.jsx';

import ErrorIcon from 'SVG/google/error.svg';
import PendingIcon from 'SVG/google/pending.svg';
import FolderIcon from 'SVG/google/folder.svg';

import TextField from '../common/input/textfield.jsx';
import EditControls from '../common/edit-controls.jsx';
import Tooltip from '../../tooltip.jsx';

// ****************
// State Management
// ****************

const DEF_STATE = {
  edited: false,
  label: '',
  path: '',
  count: null,
  status: null,
  errorMsg: ''
}

function reducer( state, action ) {
  switch ( action.type ) {
    case 'set':
      let { label, path, count, status } = action.source;
      if ( !label ) label = '';
      return { label, path, count, status };
    case 'label':
      return Object.assign( {}, state, { label: action.label } );
    case 'path':
      return Object.assign( {}, state, { path: action.path, status: 'unknown', count: null } );
    case 'count':
      return Object.assign( {}, state, { count: action.count, status: 'ok' } );
    case 'error':
      return Object.assign( {}, state, { status: 'error', errorMsg: 'Unable to read directory.' } );
    case 'errorMsg':
      return Object.assign( {}, state, { errorMsg: action.msg } );
    default:
      return state;
  }
}

// *********
// Component
// *********

const SourceControls = observer( ( { srcID, onDelete } ) => {
  const store = useSources();
  const [ state, dispatch ] = useReducer( reducer, DEF_STATE );
  const selected = store.getSource( srcID );

  // Reset Functionality
  function reset() {
    dispatch( { type: 'set', source: ( selected || DEF_STATE ) } );
  }

  // Reset once count is determined
  if ( selected && !state.edited && selected.count != state.count  ) reset();

  useEffect( reset, [ selected ] );

  // Select Folder Callback
  function pickFolder() {
    ipc.invoke( 'select-folder', false, state.path ).then( ( res ) => {
      if ( res.canceled ) return;
      let path = res.filePaths[ 0 ];
      dispatch( { type: 'path', path: path } );
      return ipc.invoke( 'count-folder', path ).then(
        count => dispatch( { type: 'count', count: count } ),
        err => dispatch( { type: 'error' } )
      );
    } );
  }

  // Save Callback
  function save() {
    if ( !selected ) {
      let id = store.addNew( state.path, state.label ? state.label : undefined );
      if ( !id ) dispatch( { type: 'errorMsg', msg: 'A source with that path already exists.' } )
      else reset();
    } else {
      if ( selected.path != state.path ) {
        if ( store.pathExists( state.path ) ) {
          dispatch( { type: 'errorMsg', msg: 'A source with that path already exists.' } );
          return;
        } else selected.updatePath( state.path, state.count );
      }
      if ( selected.label != state.label ) selected.setLabel( state.label ? state.label : undefined );
      reset();
    }
  }

  // Status Icon
  const metaElem = ( () => {
    if ( state.status ) {
      if ( state.status == 'ok' ) return <span className="controls__meta">{state.count}</span>;
      else if ( state.status == 'error' ) return <ErrorIcon className="controls__meta controls__meta--error"/>;
      else return <PendingIcon className="controls__meta controls__meta--pending"/>;
    } else return false;
  } )();


  // Check if modified
  const modified = ( () => {
    let comp = selected || DEF_STATE;
    return state.label != comp.label || state.path != comp.path;
  } )();

  const handlers = { save, cancel: reset, delete: () => onDelete( selected ) };
  const enable = { save: state.status == 'ok' && modified, cancel: modified, delete: selected }

  // Render
  return (
    <EditControls handlers={handlers} enable={enable}>
      <div className="controls__row">
        <TextField label="Name" value={state.label} onInput={v => dispatch({type: 'label', label: v})}/>
      </div>
      <div className="controls__row">
        <TextField value={state.path} label="Path" readOnly/>
        <Tooltip content="Select Folder" delay={[300,0]}>
          <FolderIcon className="controls__icon" onClick={pickFolder}/>
        </Tooltip>
        {metaElem}
      </div>
      {state.errorMsg ? <div className="controls__error">{state.errorMsg}</div> : false}
    </EditControls>
  )
} )

export { SourceControls as default };
