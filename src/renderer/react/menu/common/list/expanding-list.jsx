import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';

import Expander from '../expander.jsx';
import { Item } from './items.jsx';
import { SourceLabel, CollectionLabel } from './labels.jsx';
import { List } from './list.jsx';


const ExpandingList = observer( ( { store, onSelect, children, expand, controls } ) => {
  const type = store.sources ? 'source' : 'collection';
  const data = type == 'source' ? store.sources : store.collections;
  const ref = useRef();

  const items = data.map( ( obj ) => {
    const label = type == 'source' ? <SourceLabel source={obj}/> : <CollectionLabel collection={obj}/>;
    const click = ( e ) => {
      ref.current = e.currentTarget;
      onSelect( obj.id );
    }
    return (
      <Item key={obj.id} onClick={click}>
        {label}
        {controls ? controls(obj) : false}
      </Item>
    )
  } );

  return (
    <Expander from={ref} expand={expand} overlay={children}>
      <List>{ items }</List>
    </Expander>
  )
} );

export default ExpandingList;
