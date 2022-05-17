import './setup-tabs.scss'
import React from 'react';

import ToggleSet from '../common/input/toggle-set.jsx';

const SetupTabs = ( { name, labels, active, onChange} ) => {


  return (
    <React.Fragment>
      <div className='setup-tabs'>
        <span className='setup-tabs__label'>{name}</span>
        <ToggleSet className='setup-tabs__toggle' labels={labels} active={active} onChange={onChange}/>
      </div>
    </React.Fragment>
  )
}

export { SetupTabs as default };
