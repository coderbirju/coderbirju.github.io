import React, { useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { PostList } from '@components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledBlogSection = styled.section`
  max-width: 900px;

  & > ul {
    margin-top: 20px;
  }

  .all-posts {
    ${({ theme }) => theme.mixins.button};
    display: block;
    width: max-content;
    margin: 60px auto 0;
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
            ...PostListItem
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

      <PostList posts={posts} itemRef={(el, i) => (revealPosts.current[i] = el)} />

      <Link className="all-posts" to="/blog">
        View All Posts
      </Link>
    </StyledBlogSection>
  );
};

export default Blog;
