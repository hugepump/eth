const path = require('path');
const prettier = require('prettier');


function resolve(dir) {
    return path.join(__dirname, dir)
  }
// vue.config.js


module.exports = {
    publicPath: '',
    parallel: false,
    chainWebpack: (config) => {
        // Worker Loader
        config.module
            .rule('worker')
            .test(/vanity\.js$/)
            .use('worker-loader')
            .loader('worker-loader')
            .options({
                inline: 'no-fallback',
                filename: 'vanity.js',
            })
            // .devtool('source-map')
            .end();
        config.module.rule('js').exclude.add(/vanity\.js$/)
            config.module
            .rule('babel-worker')
            .test(/vanity\.js$/)
            .use('babel-loader')
            .loader('babel-loader')
            .end(); 															   						 								 																								 					
    },
    configureWebpack: {
        devtool: 'source-map',
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        plugins: process.env.DEPLOY
            ? [
                  new (require('prerender-spa-plugin'))({
                      staticDir: path.join(__dirname, 'dist'),
                      routes: ['/'],
                      postProcess(renderedRoute) {
                          renderedRoute.html = prettier
                              .format(renderedRoute.html, { filepath: 'index.html', printWidth: 120 })
                              .replace('render', 'prerender')
                              .replace(/(data-v-[0-9a-f]+)=""/gm, '$1');
                          return renderedRoute;
                      },
                  }),
              ]
            : [     
               ],
    },
};
