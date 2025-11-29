module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module-resolver', {
      alias: {
        '@app': './app',
        '@assets': './assets',
        '@modules': './modules',
        '@styles': './styles',
        '@components': './components'
      },
    }],
  ],
};
