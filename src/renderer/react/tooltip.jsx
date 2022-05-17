import './tooltip.scss';
import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const Tooltip = ( { children, content, delay = 0, theme = 'menu' } ) => {


  return (
    <Tippy content={content} theme={theme} duration={[200, 100]}
        delay={delay} placement="bottom" maxWidth='none' arrow={false}>
        {children}
    </Tippy>
  )
}

export default Tooltip;
