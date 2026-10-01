import React, { useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import kebabCase from 'lodash/kebabCase';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledBlogSection = styled.section`
  max-width: 900px;

  .posts-list {
    ${({ theme }) => theme.mixins.resetList};
    margin-top: 20px;
  }

  .all-posts {
    ${({ theme }) => theme.mixins.button};
    display: block;
    width: max-content;
    margin: 60px auto 0;
  }
`;

const StyledPost = styled.li`
  display: flex;
  align-items: center;
  gap: 40px;
  position: relative;
  padding: 30px 0;
  border-bottom: 1px solid var(--lightest-navy);

  @media (max-width: 480px) {
    gap: 20px;
    padding: 25px 0;
  }

  &:hover,
  &:focus-within {
    .post-title a {
      color: var(--green);
    }
  }

  .post-content {
    flex: 1;
    min-width: 0;
  }

  .post-meta {
    margin: 0 0 10px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    text-transform: uppercase;
  }

  .post-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: clamp(var(--fz-lg), 3vw, var(--fz-xxl));
    line-height: 1.3;

    a {
      position: static;
      transition: var(--transition);

      /* Stretch the title link over the whole row so any click opens the post */
      &:before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 0;
      }
    }
  }

  .post-desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
    color: var(--slate);
    font-size: var(--fz-lg);

    @media (max-width: 480px) {
      font-size: var(--fz-md);
    }
  }

  .post-tags {
    ${({ theme }) => theme.mixins.resetList};
    display: flex;
    flex-wrap: wrap;
    gap: 5px 15px;
    margin-top: 15px;

    a {
      position: relative;
      z-index: 1;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
    }
  }

  .post-cover {
    flex-shrink: 0;
    width: 160px;
    border-radius: var(--border-radius);
    overflow: hidden;

    @media (max-width: 600px) {
      width: 90px;
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
            timeToRead
            frontmatter {
              title
              description
              slug
              date
              tags
              cover {
                childImageSharp {
                  gatsbyImageData(
                    width: 320
                    aspectRatio: 1.5
                    placeholder: BLURRED
                    formats: [AUTO, WEBP, AVIF]
                  )
                }
              }
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

      <ul className="posts-list">
        {posts.map(({ node }, i) => {
          const { timeToRead, frontmatter } = node;
          const { title, description, slug, date, tags, cover } = frontmatter;
          const image = getImage(cover);
          const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
          });

          return (
            <StyledPost key={slug} ref={(el) => (revealPosts.current[i] = el)}>
              <div className="post-content">
                <p className="post-meta">
                  <time>{formattedDate}</time> &middot; {timeToRead} min read
                </p>
                <h3 className="post-title">
                  <Link to={slug}>{title}</Link>
                </h3>
                <p className="post-desc">{description}</p>
                {tags && tags.length > 0 && (
                  <ul className="post-tags">
                    {tags.map((tag) => (
                      <li key={tag}>
                        <Link to={`/blog/tags/${kebabCase(tag)}/`}>#{tag}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {image && (
                <div className="post-cover">
                  <GatsbyImage image={image} alt={`Cover image for ${title}`} />
                </div>
              )}
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
