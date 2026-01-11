import React, { useEffect, useRef } from 'react';
import { Icon } from '@components/icons';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const StyledOpenSourceSection = styled.section`
  max-width: 900px;

  .opensource-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;
  }
`;

const StyledContribution = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .contribution-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .contribution-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
  }

  .contribution-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .folder {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .contribution-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .contribution-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .contribution-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .contribution-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const OpenSource = () => {
  const revealContainer = useRef(null);
  const revealContributions = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
    revealContributions.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, [prefersReducedMotion]);

  const contributions = [
    {
      title: 'add healthcheck orchestration logic 4427',
      description:
        'Added comprehensive health check support to nerdctl, including CLI flags, systemd integration, and Docker-compatible functionality for container lifecycle management.',
      tech: ['Go', 'systemd'],
      external: 'https://github.com/containerd/nerdctl/pull/4427',
      github: 'https://github.com/containerd/nerdctl',
    },
    {
      title: 'add soci to nerdctl image convert 4300',
      description: 'This PR adds functionality to support nerdctl image convert using soci.',
      tech: ['Go'],
      external: 'https://github.com/containerd/nerdctl/pull/4300',
      github: 'https://github.com/containerd/nerdctl',
    },
    {
      title: 'Add support for SOCI V2 index generation',
      description: 'This PR added soci V2 index generation in the aws-index-builder cfn stack',
      tech: ['python', 'cloudformation'],
      external: 'https://github.com/awslabs/cfn-ecr-aws-soci-index-builder/pull/72',
      github: 'https://github.com/awslabs/cfn-ecr-aws-soci-index-builder',
    },
    {
      title: 'feat: Opa middleware support (Experimental) 156',
      description:
        'This PR adds API allowlisting functionality(Experimental) to finch-daemon APIs using opa policy evaluation middleware',
      tech: ['Go'],
      external: 'https://github.com/runfinch/finch-daemon/pull/156',
      github: 'https://github.com/runfinch/finch-daemon',
    },
    {
      title: 'ci: Add release automation #28',
      description: 'add release automation for finch-daemon',
      tech: ['Github Actions', 'CI/CD', 'Shell'],
      external: 'https://github.com/runfinch/finch-daemon/pull/28',
      github: 'https://github.com/runfinch/finch-daemon',
    },
    {
      title: 'fix: Return empty network settings for non started containers',
      description: 'fixes a network inspect incompatability with docker',
      tech: ['Go'],
      external: 'https://github.com/containerd/nerdctl/pull/4015',
      github: 'https://github.com/containerd/nerdctl',
    },
  ];

  return (
    <StyledOpenSourceSection id="opensource" ref={revealContainer}>
      <h2 className="numbered-heading">Open Source Contributions</h2>

      <p>
        I actively contribute to the container ecosystem through open-source projects, focusing on
        improving container runtimes, tooling, and developer experience.
      </p>

      <ul className="opensource-grid">
        {contributions.map(({ title, description, tech, external, github }, i) => (
          <StyledContribution key={i} ref={(el) => (revealContributions.current[i] = el)}>
            <div className="contribution-inner">
              <header>
                <div className="contribution-top">
                  <div className="folder">
                    <Icon name="GitHub" />
                  </div>
                  <div className="contribution-links">
                    {github && (
                      <a
                        href={github}
                        aria-label="Repository Link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon name="GitHub" />
                      </a>
                    )}
                    {external && (
                      <a
                        href={external}
                        aria-label="Pull Request Link"
                        className="external"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon name="External" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="contribution-title">
                  <a href={external} target="_blank" rel="noreferrer">
                    {title}
                  </a>
                </h3>

                <div
                  className="contribution-description"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </header>

              <footer>
                {tech && (
                  <ul className="contribution-tech-list">
                    {tech.map((tech, i) => (
                      <li key={i}>{tech}</li>
                    ))}
                  </ul>
                )}
              </footer>
            </div>
          </StyledContribution>
        ))}
      </ul>
    </StyledOpenSourceSection>
  );
};

export default OpenSource;
