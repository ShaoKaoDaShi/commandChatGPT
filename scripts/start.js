const webpack = require('webpack');
const config = require('../config/webpack.config');

start()

function start(){
    const compiler = webpack(config);
    // compiler.run((err, stats) => {
    //     // console.log(err, stats)
    //     // console.log(err)
    // })

    const watching = compiler.watch(
        {
          // 示例
          aggregateTimeout: 300,
          ignored:['/dist']
        },
        (err, stats) => {
            console.log('xixi')
            compiler.run((err, stats) => {
                // console.log(err, stats)
                // console.log(err)
            })
        //   这里打印 watch/build 结果...
        //   console.log(stats);
        }
      );

      setTimeout(()=>{
        watching.close((err)=>{})
      },1000*60)
}
