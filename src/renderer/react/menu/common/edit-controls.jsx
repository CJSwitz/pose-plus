import './edit-controls.scss';
import React from 'react';

const EditControls = ( { children, handlers, enable } ) => {
  const s = 'button' + ( enable.save ? ' button--green' : ' button--disabled' );
  const c = 'button' + ( enable.cancel ? ' button--grey' : ' button--disabled' );
  const d = 'button' + ( enable.delete ? ' button--red' : ' button--disabled' );

  return (
    <div className="controls">
      {children}
      <div className="controls__row">
        {handlers.save ? <button className={s}  disabled={!enable.save} onClick={handlers.save}>Save</button> : false}
        {handlers.cancel ? <button className={c} disabled={!enable.cancel} onClick={handlers.cancel}>Cancel</button> : false}
        <span className="fillEmpty"/>
        {handlers.delete ? <button className={d} disabled={!enable.delete} onClick={handlers.delete}>Delete</button> : false}
      </div>
    </div>
  )
}

export default EditControls;
