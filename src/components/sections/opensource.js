import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const contributions = [
  {
    title: 'Add healthcheck orchestration logic',
    description:
      'Added comprehensive health check support to nerdctl, including CLI flags, systemd integration, and Docker-compatible functionality for container lifecycle management.',
    tech: ['Go', 'systemd'],
    url: 'https://github.com/containerd/nerdctl/pull/4427',
  },
  {
    title: 'Add SOCI to nerdctl image convert',
    description: 'Added support for converting images to SOCI with nerdctl image convert.',
    tech: ['Go'],
    url: 'https://github.com/containerd/nerdctl/pull/4300',
  },
  {
    title: 'Add support for SOCI V2 index generation',
    description: 'Added SOCI V2 index generation to the aws-index-builder CloudFormation stack.',
    tech: ['Python', 'CloudFormation'],
    url: 'https://github.com/awslabs/cfn-ecr-aws-soci-index-builder/pull/72',
  },
  {
    title: 'OPA middleware support (Experimental)',
    description:
      'Added experimental API allowlisting to finch-daemon using an OPA policy evaluation middleware.',
    tech: ['Go'],
    url: 'https://github.com/runfinch/finch-daemon/pull/156',
  },
  {
    title: 'Add release automation',
    description: 'Added release automation for finch-daemon.',
    tech: ['GitHub Actions', 'CI/CD', 'Shell'],
    url: 'https://github.com/runfinch/finch-daemon/pull/28',
  },
  {
    title: 'Return empty network settings for non-started containers',
    description: 'Fixed a network inspect incompatibility with Docker.',
    tech: ['Go'],
    url: 'https://github.com/containerd/nerdctl/pull/4015',
  },
];

// Splits https://github.com/<owner>/<repo>/pull/<number> into the repo label, repo URL, and PR number
const parsePullUrl = (url) => {
  const [, owner, repo, , number] = new URL(url).pathname.split('/');
  return { repo: `${owner}/${repo}`, repoUrl: `https://github.com/${owner}/${repo}`, number };
};

const StyledOpenSourceSection = styled.section`
  max-width: 900px;

  .intro {
    margin-bottom: 50px;
  }

  .timeline {
    ${({ theme }) => theme.mixins.resetList};
    position: relative;
    padding-left: 30px;

    /* The vertical line the dots sit on */
    &:before {
      content: '';
      position: absolute;
      top: 8px;
      bottom: 8px;
      left: 5px;
      width: 2px;
      background-color: var(--lightest-navy);
    }
  }
`;

const StyledContribution = styled.li`
  position: relative;
  padding-bottom: 35px;

  &:last-of-type {
    padding-bottom: 0;
  }

  &:before {
    content: '';
    position: absolute;
    top: 5px;
    left: -30px;
    width: 12px;
    height: 12px;
    border: 2px solid var(--green);
    border-radius: 50%;
    background-color: var(--navy);
    transition: var(--transition);
  }

  &:hover:before,
  &:focus-within:before {
    background-color: var(--green);
  }

  .pr-ref {
    margin: 0 0 5px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    .number {
      color: var(--slate);
    }
  }

  .pr-title {
    margin: 0 0 5px;
    font-size: var(--fz-xl);
    line-height: 1.3;

    a {
      color: var(--lightest-slate);
      transition: var(--transition);

      &:hover,
      &:focus {
        color: var(--green);
      }
    }
  }

  .pr-desc {
    margin: 0;
    color: var(--slate);
  }

  .pr-tech {
    ${({ theme }) => theme.mixins.resetList};
    display: flex;
    flex-wrap: wrap;
    gap: 5px 15px;
    margin-top: 10px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
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

  return (
    <StyledOpenSourceSection id="opensource" ref={revealContainer}>
      <h2 className="numbered-heading">Open Source Contributions</h2>

      <p className="intro">
        I actively contribute to the container ecosystem through open-source projects, focusing on
        improving container runtimes, tooling, and developer experience.
      </p>

      <ol className="timeline">
        {contributions.map(({ title, description, tech, url }, i) => {
          const { repo, repoUrl, number } = parsePullUrl(url);

          return (
            <StyledContribution key={url} ref={(el) => (revealContributions.current[i] = el)}>
              <p className="pr-ref">
                <a href={repoUrl} target="_blank" rel="noreferrer">
                  {repo}
                </a>{' '}
                <span className="number">#{number}</span>
              </p>

              <h3 className="pr-title">
                <a href={url} target="_blank" rel="noreferrer">
                  {title}
                </a>
              </h3>

              <p className="pr-desc">{description}</p>

              {tech && (
                <ul className="pr-tech">
                  {tech.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </StyledContribution>
          );
        })}
      </ol>
    </StyledOpenSourceSection>
  );
};

export default OpenSource;
