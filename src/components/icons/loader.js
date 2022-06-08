import React from 'react';

const IconLoader = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <title>Loader Logo</title>
    <g>
      {/* <g id="B" transform="translate(11.000000, 5.000000)">
        <path
          d="M 9.072 9.45 L 7.854 9.94 L 6.762 7.14 L 2.226 7.14 L 1.134 9.912 L 0 9.45 L 3.836 0 L 5.292 0 L 9.072 9.45 Z M 4.494 1.316 L 2.646 6.02 L 6.328 6.02 L 4.494 1.316 Z"
          fill="currentColor"
        />
      </g> */}
      <path
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m 50, 5
                  L 11, 27
                  L 11, 72
                  L 50, 95
                  L 89, 73
                  L 89, 28 z"
      />
    </g>
    <text
      x="28"
      y="55"
      fill="currentColor"
      fontSize="30px"
      fontWeight="bold"
      fontFamily="Helvetica"
    >
      AR
    </text>
  </svg>
);

export default IconLoader;
