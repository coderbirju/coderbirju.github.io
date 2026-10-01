import React from 'react';
import { Link, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import kebabCase from 'lodash/kebabCase';

// Fields every post row needs. Use as `...PostListItem` on a MarkdownRemark node in any query.
export const query = graphql`
  fragment PostListItem on MarkdownRemark {
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
`;

const StyledPostList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
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

const PostList = ({ posts, itemRef }) => (
  <StyledPostList>
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
        <StyledPost key={slug} ref={itemRef ? (el) => itemRef(el, i) : undefined}>
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
  </StyledPostList>
);

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  itemRef: PropTypes.func,
};

export default PostList;
