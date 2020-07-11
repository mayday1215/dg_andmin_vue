const path = require('path');
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  // publicPath:"./",  // 可以设置成相对路径，这样所有的资源都会被链接为相对路径，打出来的包可以被部署在任意路径
  // outputDir:"dist",  //打包时生成的生产环境构建文件的目录
  // assetsDir: 'public',  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  chainWebpack: (config)=>{
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets',resolve('src/assets'))
      .set('components',resolve('src/components'))
      .set('views',resolve('src/views'))
      .set('network',resolve('src/network'))
  },
}


