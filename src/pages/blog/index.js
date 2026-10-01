import React from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, PostList, Seo } from '@components';

const StyledMainContainer = styled.main`
  max-width: 900px;

  & > header {
    margin-bottom: 30px;

    .subtitle {
      ${({ theme }) => theme.mixins.flexBetween};
      flex-wrap: wrap;
      gap: 10px;
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
    }
  }

  .empty {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
  }
`;

const BlogPage = ({ location, data }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location}>
      <StyledMainContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/#blog">Home</Link>
        </span>

        <header>
          <h1 className="big-heading">Blog</h1>
          <p className="subtitle">
            <span>Notes on what I&apos;m building and learning</span>
            <Link to="/blog/tags">Browse by tag</Link>
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="empty">No posts yet. Check back soon.</p>
        ) : (
          <PostList posts={posts} />
        )}
      </StyledMainContainer>
    </Layout>
  );
};

BlogPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default BlogPage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/posts/" }, frontmatter: { draft: { ne: true } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          ...PostListItem
        }
      }
    }
  }
`;

export const Head = ({ location }) => <Seo title="Blog" pathname={location.pathname} />;
