import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { Transition } from '@components';
import { loaderDelay } from '@utils';
import { useIntro, usePrefersReducedMotion } from '@hooks';

const StyledSideElement = styled.div`
  width: 40px;
  position: fixed;
  bottom: 0;
  left: ${(props) => (props.orientation === 'left' ? '40px' : 'auto')};
  right: ${(props) => (props.orientation === 'left' ? 'auto' : '40px')};
  z-index: 10;
  color: var(--light-slate);

  @media (max-width: 1080px) {
    left: ${(props) => (props.orientation === 'left' ? '20px' : 'auto')};
    right: ${(props) => (props.orientation === 'left' ? 'auto' : '20px')};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Side = ({ children, orientation }) => {
  const playIntro = useIntro();
  const [isMounted, setIsMounted] = useState(!playIntro);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!playIntro || prefersReducedMotion) {
      return;
    }
    const timeout = setTimeout(() => setIsMounted(true), loaderDelay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <StyledSideElement orientation={orientation}>
      {prefersReducedMotion ? (
        <>{children}</>
      ) : (
        <TransitionGroup component={null}>
          {isMounted && (
            <Transition classNames={playIntro ? 'fade' : ''} timeout={playIntro ? loaderDelay : 0}>
              {children}
            </Transition>
          )}
        </TransitionGroup>
      )}
    </StyledSideElement>
  );
};

Side.propTypes = {
  children: PropTypes.node.isRequired,
  orientation: PropTypes.string,
};

export default Side;
