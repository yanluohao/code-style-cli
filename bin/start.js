#!/usr/bin/env node
// 文件头部的 #!/usr/bin/env node 这一句是告诉 shell 要以 node 来解析接下来的 learn 文件
// argv[0]是node的路径
// 打印 process.argv。
// process.argv.forEach((val, index) => {
//   console.log(`${index}: ${val}`);
// });
// 启动 Node.js 进程：

// $ node process-args.js one two=three four
// 输出如下：

// 0: /usr/local/bin/node
// 1: /Users/mjr/work/node/process-args.js
// 2: one
// 3: two=three
// 4: four

require('..')