import React from 'react';
import { Link, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, PostList, Seo } from '@components';

const StyledTagsContainer = styled.main`
  max-width: 900px;

  h1 {
    ${({ theme }) => theme.mixins.flexBetween};
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      font-weight: 400;
    }
  }
`;

const TagTemplate = ({ pageContext, data, location }) => {
  const { tag } = pageContext;
  const { edges } = data.allMarkdownRemark;

  return (
    <Layout location={location}>
      <StyledTagsContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/blog">All posts</Link>
        </span>

        <h1>
          <span>#{tag}</span>
          <Link to="/blog/tags">View all tags</Link>
        </h1>

        <PostList posts={edges} />
      </StyledTagsContainer>
    </Layout>
  );
};

export default TagTemplate;

TagTemplate.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
  location: PropTypes.object,
};

export const pageQuery = graphql`
  query ($tag: String!) {
    allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } } }
    ) {
      totalCount
      edges {
        node {
          ...PostListItem
        }
      }
    }
  }
`;

export const Head = ({ location, pageContext }) => (
  <Seo title={`Tagged: #${pageContext.tag}`} pathname={location.pathname} />
);
