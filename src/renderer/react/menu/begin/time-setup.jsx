import './time-setup.scss';
import React from 'react';
import { observer } from 'mobx-react-lite';

import { usePrefs } from '../../store-hooks.jsx';

import SetupTabs from './setup-tabs.jsx';
import { SimpleTimer, AdvancedTimer } from './timer';

const TIME_MODES = [ 'Off', 'Simple', 'Advanced' ];

function ErrorMsg( { msg } ) {
  return <div className="time-setup__error">{msg}</div>;
}

const TimeSetup = observer( ( props ) => {
  const store = usePrefs();
  const { session } = store;
  const { mode, simple, advanced } = session.timer;

  let timeSetup = false;
  let error = false;

  if ( mode == 1 ) {
    if ( simple.time <= 0 || Number.isNaN( simple.time ) ) error = <ErrorMsg msg="Timer must be greater than zero."/>;
    timeSetup = <SimpleTimer time={simple} onChange={(v) => session.updateTimer({simple: v})} error={Boolean(error)}/>;
  } else if ( mode == 2 ) {
    if ( advanced.some( t => t.time <= 0 || Number.isNaN( t.time ) ) ) error = <ErrorMsg msg="Timer must be greater than zero."/>;
    else if ( advanced.some( t => Number.isNaN( t.images ) ) ) error = <ErrorMsg msg="Number of images must be specified."/>;
    timeSetup = <AdvancedTimer timers={advanced} onChange={(v) => session.updateTimer({advanced: v})}/>
  }

  return (
    <React.Fragment>
      <SetupTabs name="Timer" labels={TIME_MODES} active={mode} onChange={(v) => session.updateTimer({mode: v})}/>
        <div className={mode == 1 ? "time-setup time-setup--simple": "time-setup"}>
          {timeSetup}
          {error}
        </div>
    </React.Fragment>
  )

} );

export { TimeSetup as default };
