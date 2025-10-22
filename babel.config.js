module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module-resolver', {
      alias: {
        '@app': './app',
        '@assets': './assets',
        '@components': './modules',
        '@styles': './styles',
      },
    }],
  ],
};
