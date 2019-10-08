const download = require('download-git-repo');

download('http://192.168.2.3:test-group/test-cli#0.0.1', 'test2', {clone: true}, (err) => {
  if (err) console.log(`err ${err}`)
})