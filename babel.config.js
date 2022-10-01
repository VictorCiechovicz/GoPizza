module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],

    //com esse pluguin abaixo ele deixa menor a importação de arquivos da nossa pasta rooot src, depois vai para o tsconfig.
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ts', '.tsx', '.js', '.json'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@assets': './src/assets',
            '@hooks': './src/hooks',
            '@utils': './src/utils'
          }
        }
      ]
    ]
  }
}
