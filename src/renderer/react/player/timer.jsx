import './timer.scss';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { usePrefs } from '../store-hooks.jsx';

import { msToString } from 'LIB/time.js';

const Timer = observer( ( { session } ) => {
  const store = usePrefs();
  let clazz = "player-timer";
  if ( store.prefs.dockTimer ) clazz += ' ' + clazz + '--docked';

  return <div className={clazz}>{msToString( session.timer.time * 1000, false )}</div>
} );

export { Timer as default };
