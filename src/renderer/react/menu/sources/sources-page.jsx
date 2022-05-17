import React, { useState, useReducer } from 'react';
import { observer } from 'mobx-react-lite';

import ImageIcon from 'SVG/google/image.svg';
import FolderIcon from 'SVG/google/folder.svg';
import DeleteIcon from 'SVG/google/delete_fill.svg';
import OpenIcon from 'SVG/google/open_in_new.svg';

import { useSources, useUiState } from '../../store-hooks.jsx';

import { SetHeader } from '../common/headers.jsx';
import SourceControls from './source-controls.jsx';
import { DataList } from '../common/list';
import Tooltip from '../../tooltip.jsx';
import ConfirmDialog from '../common/confirm-dialog.jsx';
import BreakingPath from '../../breaking-path.jsx';

function reducer( state, action ) {
  if ( action.type == 'close' ) return { ...state, show: false };
  else if ( action.type == 'show' ) {
    const { callback, message } = action;
    return { callback, message, show: true };
  } else return state;
}

const SourcePage = observer( ( props ) => {
  const [ reset, setReset ] = useState( 0 );
  const [ selected, setSelected ] = useState( [] );
  const [ modal, dispatch ] = useReducer( reducer, { show: false } );
  const store = useSources();
  const uiState = useUiState();

  const onNew = () => {
    ipc.invoke( 'select-folder', true ).then( ( res ) => {
      if ( res.canceled ) return;
      let lastID;

      res.filePaths.forEach( ( path ) => {
        let id = store.addNew( path );
        if ( id ) lastID = id;
      } )

      if ( lastID ) {
        setSelected( [ lastID ] );
        setReset( ( a ) => a + 1 ); // Goofy workaround for force-select
      }
    } );
  }

  const onDelete = ( source ) => {
    const name = source.label ? source.label : <BreakingPath path={source.path}/>;
    if ( !uiState.confirm ) store.remove( source.id )
    else {
      dispatch( {
        type: 'show',
        message: name,
        callback: () => store.remove( source.id )
      } );
    }
  }


  const getControls = ( source ) => {
    return (
      <React.Fragment>
        <Tooltip content="Open Folder" delay={[300,0]}>
          <OpenIcon className="list__control" onClick={() => ipc.send('open-folder', source.path)}/>
        </Tooltip>
        <Tooltip content = "Delete" delay = {[ 300, 0 ]} >
          <DeleteIcon className="list__control" onClick={() => onDelete(source)}/>
        </Tooltip>
      </React.Fragment>
    )
  }

  return (
    <div className="page">
        <SetHeader name="Sources" onClick={onNew}>
            <span>{store.sources.length}</span>
            <FolderIcon className="header__icon"/>
            <span>{store.sources.map( s => s.count ).reduce( ( a, b ) => a + b, 0 )}</span>
            <ImageIcon className="header__icon"/>
        </SetHeader>
        <DataList store={store} controls={getControls} onSelect={setSelected} preSelect={selected} reset={reset}/>
      <SourceControls srcID={selected} onDelete={onDelete}/>
      <ConfirmDialog show={modal.show} header='Delete Source?' onClose={() => dispatch({type: 'close'})} onConfirm={modal.callback}>
        {modal.message}
      </ConfirmDialog>
    </div>
  )
} );

export { SourcePage as default }
