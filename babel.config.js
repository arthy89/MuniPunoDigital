module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'module:react-native-dotenv',
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@bus-tracker': './src/modules/bus-tracker',
          '@discover-puno': './src/modules/discover-puno',
          '@phone-directory': './src/modules/phone-directory',
          '@public-lighting': './src/modules/public-lighting',
          '@puno-safe': './src/modules/puno-safe',
          '@security': './src/modules/security',
          '@service-desk': './src/modules/service-desk',
          '@evidence-capture': './src/modules/evidence-capture',
          '@tupa': './src/modules/tupa',
          '@solid-waste': './src/modules/solid-waste',
          '@home': './src/modules/home',
        },
        extensions: ['.ts', '.tsx', '.json'],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
