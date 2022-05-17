import React from 'react';

import ImageIcon from 'SVG/google/image.svg';

import Checkbox from '../input/checkbox.jsx';

const Item = ( { children, className, onClick } ) => {
  let clazz = 'list__item';
  if ( className ) clazz += ' ' + className;

  return (
    <div className={clazz} onClick={onClick}>
      {children}
    </div>
  )
}

const SelectableItem = ( { children, selected, onClick, checkbox } ) => {
  return (
    <Item className={selected ? "list__item--selected" : false}  onClick={onClick}>
      {checkbox ? <Checkbox checked={selected} className="list__cbx"/> : false}
      {children}
    </Item>
  )
}

const HeaderItem = ( { type, checked, indeterminate, onClick } ) => {
  const name = type.charAt( 0 ).toUpperCase() + type.substring( 1 ).toLowerCase();
  const clazz = checked || indeterminate ? 'list__item--selected' : undefined;

  return (
    <Item className={clazz} onClick={onClick}>
      <Checkbox className="list__cbx" type="checkbox" checked={checked} indeterminate={indeterminate}/>
      <span className="list__header-label">{name}</span>
      <span className="fillEmpty"/>
      <ImageIcon className="list__icon list__count"/>
    </Item>
  );
}

export { Item, SelectableItem, HeaderItem };
