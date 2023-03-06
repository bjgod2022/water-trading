const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const { defineConfig } = require('@vue/cli-service')
// 
const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}
// 
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('src')) //处理svg目录（根据你建的文件路径）
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ]
  },
  pluginOptions:{
    electronBuilder:{
      noAppProtocal: true,
      // customFileProtocol: "./",
      nodeIntegration:true,
      chainWebpackRendererProcess: (config) => {
          // Chain webpack config for electron renderer process only
          // The following example will set IS_ELECTRON to true in your app
          config.plugin('define').tap((args) => {
              args[0]['IS_ELECTRON'] = true
              return args
          })
      },
      builderOptions: {
        appId: "dds",
        productName: "周易选股",
        files: ["**/*", "static/*"],
        asar: true,
        win: {
            icon: "./src/assets/logo.ico",
            target: ["zip", "nsis"],
        },
        // publish: [{
        //     provider: "generic",
        //     url: "http://localhost:8888/", //这里配置的是安装包和lastest.yml的服务器地址
        //     publishAutoUpdate: true,

        // }],
        nsis: {
            
        }
        
        
      }
    }
  },
  

  lintOnSave:false,
  productionSourceMap:false,
  publicPath:"./",
  devServer: {
    // port: 3333,
    open: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:2030", // 后台访问地址
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
})
