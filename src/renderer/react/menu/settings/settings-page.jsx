import React from 'react';

import { ToggleSetting, ColorSetting } from './settings.jsx';
import { Header } from '../common/headers.jsx';

export default function SettingsPage( props ) {
  return (
    <div className="page">
        <Header name="Settings"/>
        <div className='seperator'/>
        <div className="settings">
          <ToggleSetting prefKey="independantSize">Track player window position seperately</ToggleSetting>
          <ToggleSetting prefKey="autoBG">Auto background color</ToggleSetting>
          <ColorSetting prefKey="bgCol">Player background color</ColorSetting>
        </div>
    </div>
  )
}
