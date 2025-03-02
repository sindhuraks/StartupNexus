module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // Transform JS/JSX/TS/TSX files with Babel
      },
      moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',  // Mock .css imports using identity-obj-proxy
      },
      transformIgnorePatterns: [
        "/node_modules/(?!next-auth|react-dnd)"  // Optional: if you need specific node modules
      ],
  };
  