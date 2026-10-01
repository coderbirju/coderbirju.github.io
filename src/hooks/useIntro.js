import { createContext, useContext } from 'react';

// True while the homepage intro (loader + staggered fade-ins) should play. Layout sets it only for
// the first homepage render of a visit, so navigating back from another page skips the intro.
export const IntroContext = createContext(false);

const useIntro = () => useContext(IntroContext);

export default useIntro;
