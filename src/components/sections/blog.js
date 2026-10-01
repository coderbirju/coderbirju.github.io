import React, { useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import kebabCase from 'lodash/kebabCase';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { IconBookmark } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledBlogSection = styled.section`
  max-width: 1000px;

  .posts-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .all-posts {
    ${({ theme }) => theme.mixins.button};
    display: block;
    width: max-content;
    margin: 60px auto 0;
  }
`;

const StyledPost = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .post-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .post-inner {
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

  .post-icon {
    margin-bottom: 30px;
    color: var(--green);

    svg {
      width: 40px;
      height: 40px;
    }
  }

  .post-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      /* Stretch the title link over the whole card so any click opens the post */
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

  .post-desc {
    color: var(--light-slate);
    font-size: 17px;
  }

  footer {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-top: 20px;
  }

  .post-date {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    text-transform: uppercase;
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const Blog = () => {
  const data = useStaticQuery(graphql`
    query {
      posts: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/posts/" }, frontmatter: { draft: { ne: true } } }
        sort: { frontmatter: { date: DESC } }
        limit: 3
      ) {
        edges {
          node {
            frontmatter {
              title
              description
              slug
              date
              tags
            }
          }
        }
      }
    }
  `);

  const posts = data.posts.edges;
  const revealTitle = useRef(null);
  const revealPosts = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealPosts.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, [prefersReducedMotion]);

  if (posts.length === 0) {
    return null;
  }

  return (
    <StyledBlogSection id="blog">
      <h2 className="numbered-heading" ref={revealTitle}>
        Latest Writing
      </h2>

      <ul className="posts-grid">
        {posts.map(({ node }, i) => {
          const { title, description, slug, date, tags } = node.frontmatter;
          const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
          });

          return (
            <StyledPost key={slug} ref={(el) => (revealPosts.current[i] = el)}>
              <div className="post-inner">
                <header>
                  <div className="post-icon">
                    <IconBookmark />
                  </div>
                  <h3 className="post-title">
                    <Link to={slug}>{title}</Link>
                  </h3>
                  <p className="post-desc">{description}</p>
                </header>

                <footer>
                  <time className="post-date">{formattedDate}</time>
                  {tags && tags.length > 0 && (
                    <ul className="post-tags">
                      {tags.map((tag) => (
                        <li key={tag}>
                          <Link to={`/blog/tags/${kebabCase(tag)}/`}>#{tag}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </footer>
              </div>
            </StyledPost>
          );
        })}
      </ul>

      <Link className="all-posts" to="/blog">
        View All Posts
      </Link>
    </StyledBlogSection>
  );
};

export default Blog;
