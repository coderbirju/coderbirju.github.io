/* eslint-disable react-hooks/refs, react-hooks/immutability --
   merging the child's own ref with nodeRef is the intended use of a callback ref here */
import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

// CSSTransition falls back to ReactDOM.findDOMNode when no nodeRef is given, which React 19
// removed. This wrapper creates the nodeRef and attaches it to the single child element,
// preserving any ref the child already has.
const Transition = ({ children, ...props }) => {
  const nodeRef = useRef(null);
  const childRef = children.props.ref;

  const ref = useCallback(
    (el) => {
      nodeRef.current = el;
      if (typeof childRef === 'function') {
        childRef(el);
      } else if (childRef) {
        childRef.current = el;
      }
    },
    [childRef]
  );

  return (
    <CSSTransition nodeRef={nodeRef} {...props}>
      {React.cloneElement(children, { ref })}
    </CSSTransition>
  );
};

Transition.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Transition;
