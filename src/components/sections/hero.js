import React, { useState, useEffect } from 'react';
import { TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { Transition } from '@components';
import { navDelay, loaderDelay } from '@utils';
import { useIntro, usePrefersReducedMotion } from '@hooks';
// import { email } from '@config';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;

  @media (max-width: 480px) and (min-height: 700px) {
    padding-bottom: 10vh;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 10px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const playIntro = useIntro();
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Arjun.</h2>;
  const three = (
    <h3 className="big-heading">
      Backend engineer.
      <br />
      Builder at heart.
    </h3>
  );
  const four = (
    <>
      <p>
        I&apos;m happiest when I&apos;m building. By day, that means distributed systems at{' '}
        <a href="https://aws.amazon.com/lambda/" target="_blank" rel="noreferrer">
          AWS Lambda
        </a>
        , where I&apos;m learning what it takes to keep things fast and reliable at a scale that
        still amazes me. By night, it&apos;s my own projects: tools I wish existed, built with a lot
        of help from AI.
      </p>
    </>
  );

  const items = [one, two, three, four];

  return (
    <StyledHeroSection>
      {prefersReducedMotion || !playIntro ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <Transition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </Transition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
