import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Seo, Hero, About, Jobs, Featured, Blog, OpenSource, Contact } from '@components';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <StyledMainContainer className="fillHeight">
      <Hero />
      <About />
      <Jobs />
      <Blog />
      <Featured />
      <OpenSource />
      <Contact />
    </StyledMainContainer>
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;

export const Head = ({ location }) => <Seo pathname={location.pathname} />;
