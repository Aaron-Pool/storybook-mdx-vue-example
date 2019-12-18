const util = require('util');
const path = require('path');

module.exports = {
  presets: ['@storybook/addon-docs/preset'],
  stories: ['../src/**/*.stories.(js|mdx)'],

  // Modify webpack to remove babel-preset-vue from .mdx loaders
  webpack: async config => {
    const mdxRules = config.module.rules.filter(({ test }) => {
      return String(test) === String(/\.mdx$/) || String(test) === String(/\.(stories|story).mdx$/)
    })
    mdxRules.forEach(mdxRule => {
      const [babelLoader] = mdxRule.use.filter(({ loader }) => loader === 'babel-loader')
      babelLoader.options.presets = babelLoader.options.presets.filter(preset => !preset.includes('babel-preset-vue'))
    })

    config.module.rules.push({
        test: /\.(mjs|jsx?)$/,
        use: [{
            loader: 'babel-loader',
            options: {
            cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/storybook'),
            presets: ['@vue/app'],
            babelrc: false
            }
        }],
        exclude: [path.resolve(__dirname, '../node_modules')]
    });

    return config
  }
}
