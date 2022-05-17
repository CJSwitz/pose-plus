import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { SelectableItem, HeaderItem } from './items.jsx';
import { SourceLabel, CollectionLabel } from './labels.jsx';
import { List } from './list.jsx';

const DataList = observer( ( { store, controls, onSelect, preSelect, reset, multi, addClass } ) => {
  const type = store.sources ? 'source' : 'collection';
  const data = type == 'source' ? store.sources : store.collections;
  const initState = preSelect ? preSelect : [];
  const [ selected, setSelected ] = useState( initState );

  // Changes to reset cause state to revert to default
  // This should be more performant than changing key, it just flips the state
  useEffect( () => {
    setSelected( initState );
  }, [ reset ] );

  // Invoke callback if selection changes
  useEffect( () => {
    if ( onSelect ) onSelect( selected );
  }, [ selected ] );

  // Probably should switch to reducer if this gets any bigger
  function handleSelect( s ) {
    if ( multi && s ) { // Toggle
      if ( selected.includes( s ) ) {
        setSelected( selected.filter( e => e !== s ) )
      } else setSelected( selected.concat( s ) );
    } else if ( !multi ) setSelected( [ s ] ); // Set Directly
  }



  const items = data.map( ( obj ) => {
    const label = type == 'source' ? <SourceLabel source={obj}/> : <CollectionLabel collection={obj}/>;
    return (
      <SelectableItem key={obj.id} selected={selected.includes(obj.id)}
       checkbox={multi}  onClick={() => handleSelect(obj.id)}>
        {label}
        {controls ? controls(obj) : false}
      </SelectableItem>
    )
  } );

  const allSelected = selected.length == data.length;

  // Select Everything or Nothing, only valid from multi
  function toggleAll() {
    if (allSelected) setSelected([]);
    else setSelected(data.map(d => d.id));
  }


  const header = (()=>{
    if (multi) {
      return <HeaderItem type={type} checked={allSelected} onClick={toggleAll} indeterminate={!allSelected && selected.length}/>
    } else return false
  })();

  return (
    <List onClick={() => handleSelect(null)} addClass={addClass}>
      {header}
      {items}
    </List>
  )
} );

export default DataList;
