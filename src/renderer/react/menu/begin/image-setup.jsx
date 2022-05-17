import './image-setup.scss';
import React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../store-hooks.jsx';
import SetupTabs from './setup-tabs.jsx';
import FolderIcon from 'SVG/google/folder_fill.svg';

import { DataList } from '../common/list';

const NoSources = () => {
  return (
    <div className='no-sources'>
      <div className='no-sources__row'>You haven't set up any sources!</div>
      <div className='no-sources__row'>
        Go to the&nbsp;<FolderIcon className="no-sources__icon"/>&nbsp;Sources page to set some up.
      </div>
    </div>
  )
}

const IMAGE_MODES = [ 'All', 'Collection', 'Sources' ];

const ImageSetup = observer( ( props ) => {
  const { srcStore, colStore, prefStore } = useStore();

  if ( srcStore.sources.length == 0 ) return <NoSources/>;
  else {
    const { session } = prefStore;
    const { mode, collection, sources } = session.images;

    const imageSetup = ( () => {
      switch ( mode ) {
        case 1:
          return <DataList store={colStore} preSelect={collection} onSelect={(v) => session.updateImages({collection: v})} addClass="image-setup"/>;
        case 2:
          return <DataList store={srcStore} multi preSelect={sources} onSelect={(v) => session.updateImages({sources: v})} addClass="image-setup"/>;
        default:
          return <div className="fillEmpty"/>;
      }
    } )();

    return (
      <React.Fragment>
        <SetupTabs name="Images" labels={IMAGE_MODES} active={mode} onChange={(v) => session.updateImages({mode: v})} />
        {imageSetup}

      </React.Fragment>
    )
  }
} );

export { ImageSetup as default }
