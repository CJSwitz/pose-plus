import './settings.scss';
import React from 'react';
import { observer } from 'mobx-react-lite';

import { usePrefs } from '../../store-hooks.jsx';

import Switch from '../common/input/switch.jsx';

const Setting = ( { children, label } ) => {
  return (
    <React.Fragment>
      <span className="settings__label">{label}</span>
      <span className="settings__control">
       {children}
       </span>
    </React.Fragment>
  )
}

const ToggleSetting = observer( ( { children, prefKey } ) => {
  const store = usePrefs();

  return (
    <Setting label={children}>

        <Switch on={store.prefs[prefKey]} onChange={(v) => store.set(prefKey, v)}/>

    </Setting>
  )
} );

const ColorSetting = observer( ( { children, prefKey } ) => {
  const store = usePrefs();
  const onChange = ( e ) => store.set( prefKey, e.target.value );

  return (
    <Setting label={children}>
        <input type="color" value={store.prefs[prefKey]} onChange={onChange}/>
    </Setting>
  )
} );

export { ToggleSetting, ColorSetting }
