module.exports = api => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
    plugins: [["@babel/plugin-proposal-decorators", { "legacy": true }]],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
