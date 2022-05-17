import React from 'react';
import { observer } from 'mobx-react-lite';

import PendingIcon from 'SVG/google/pending.svg';
import ErrorIcon from 'SVG/google/error.svg';

import Tooltip from '../../../tooltip.jsx';

const CountLabel = observer( ( { children, obj } ) => {
  const countElem = ( () => {
    if ( obj.status == 'unknown' ) return <PendingIcon className="list__icon"/>
    else if ( obj.status == 'error' ) return <ErrorIcon className="list__icon list__icon--error"/>
    else return <span className="list__count">{obj.count}</span>
  } )();

  return <>{children}<span className="fillEmpty"/> { countElem } </>;
} );

const SourceLabel = observer( ( { source } ) => {
  return (
    <CountLabel obj={source}>
      {source.label ? <span className="list__label">{source.label}</span> : false}
      <Tooltip content={source.path} delay={[500,100]}>
        <span className="list__sublabel list__sublabel--trunc">{source.path}</span>
      </Tooltip>
    </CountLabel>
  )
} );

const CollectionLabel = observer( ( { collection } ) => {
  return (
    <CountLabel obj={collection}>
      <span className="list__label">{collection.name}</span>
    </CountLabel>
  )
} );

export { SourceLabel, CollectionLabel }
