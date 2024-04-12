// module.exports = function (api) {
//   api.cache(true)
//   return {
//     presets: ['babel-preset-expo'],
//   }
// }

const babelConfig = (api) => {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
  }
}

export default babelConfig
