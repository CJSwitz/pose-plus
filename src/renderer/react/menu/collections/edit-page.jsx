import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import ImageIcon from 'SVG/google/image.svg';

import EditControls from '../common/edit-controls.jsx';
import TextField from '../common/input/textfield.jsx';
import { DataList } from '../common/list';
import { SetHeader } from '../common/headers.jsx';
import { useStore } from '../../store-hooks.jsx';

// ****************
// State Management
// ****************

const DEF_STATE = {
  edited: false,
  sources: [],
  name: '',
}

function reducer( state, action ) {
  switch ( action.type ) {
    case 'set':
      return action.state;
    case 'name':
      return { name: action.name, sources: state.sources };
    case 'sources':
      return { name: state.name, sources: action.sources };
    case 'errorMsg':
      return { ...state, errorMsg: action.msg };
    default:
      return state
  }
}

// *********
// Component
// *********

const EditPage = observer( ( { collection, onBack, onDelete } ) => {
  const { colStore, srcStore } = useStore();
  const [ state, dispatch ] = useReducer( reducer, DEF_STATE );
  const [ refresh, setRefresh ] = useState( 0 );

  function reset() {
    if ( collection ) {
      dispatch( { type: 'set', state: { name: collection.name, sources: collection.sources.slice() } } )
    } else {
      dispatch( { type: 'set', state: DEF_STATE } );
    }

    setRefresh( ( i ) => i + 1 );
  }

  useEffect( reset, [] );


  // Save Callback
  function save() {
    if ( collection ) {
      if ( collection.name != state.name ) {
        if ( colStore.has( state.name ) ) {
          // ERROR - Existing collection, new name already exists
          dispatch( { type: 'errorMsg', msg: 'A Collection with that name already exists.' } );
        } else {
          // OK - Existing collection, renaming with new sources
          collection.update( state.name, state.sources );
          onBack();
        }
      } else {
        // OK - Existing collection, just changing sources
        collection.setSources( state.sources );
        onBack();
      }
    } else {
      if ( colStore.has( state.name ) ) {
        // ERROR - New collection, name already exists
        dispatch( { type: 'errorMsg', msg: 'A Collection with that name already exists.' } );
      } else {
        // OK - New collection, new name
        colStore.addNew( state.name, state.sources );
        onBack();
      }
    }
  }


  // Check if Modified
  const modified = useMemo( () => {
    let comp = collection || DEF_STATE;

    if ( comp.name != state.name ) return true;
    else if ( comp.sources.length != state.sources.length ) return true;
    else if ( !comp.sources.every( c => state.sources.includes( c ) ) ) return true;
    else return false;

  }, [ state, collection ] );

  const handlers = { save, cancel: () => reset(), delete: () => onDelete(collection, onBack) }
  const enable = { save: modified, cancel: modified, delete: collection }
  const tally = srcStore.sources
    .filter( ( s ) => state.sources.includes( s.id ) )
    .map( ( s ) => s.count || 0 )
    .reduce( ( a, c ) => a + c , 0);

  return (
    <React.Fragment>
        <SetHeader name={collection ? `Edit Collection` : 'New Collection'} onClick={onBack} button="Back">
          <span>{tally}</span>
          <ImageIcon className="header__icon"/>
        </SetHeader>
        <DataList store={srcStore} multi preSelect={state.sources} onSelect={(s) => dispatch({type: 'sources', sources: s}) } reset={refresh}/>
        <EditControls handlers={handlers} enable={enable}>
          <div className="controls__row">
            <TextField label="Name" value={state.name} onInput={(str) => dispatch({type:'name', name: str})}/>
          </div>
          {state.errorMsg ? <div className="controls__error">{state.errorMsg}</div> : false}
        </EditControls>
    </React.Fragment>
  )
} )

export { EditPage as default };
