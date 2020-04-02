module.exports = {
  publicPath: './',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: false,
  // 生产环境 sourceMap
  productionSourceMap: false,
  // webpack 配置，键值对象时会合并配置，为方法时会改写配置
  configureWebpack: (config) => {

  },
  // webpack 链接 API，用于生成和修改 webapck 配置
  chainWebpack: (config) => {

  }

}
