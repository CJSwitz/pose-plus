import './test-view.scss';
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { CSSTransition } from 'react-transition-group';


const TestView = observer( () => {
  const [ show, setShow ] = useState( true );

  const clazz = show ? 'subject subject--show' : 'subject subject--hide'

  return (
    <div className='test'>
        <div className={clazz}>
          Hello World
        </div>

      <button onClick={()=>{setShow(!show)}}>
        {show ? "Hide" : "Show"}
      </button>

    </div>
  )
} )

export { TestView as default };
