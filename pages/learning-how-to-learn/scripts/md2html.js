var marked = require('marked');
var fs = require('fs');

marked.setOptions({
    headerIds: false,
})

var readMe = fs.readFileSync('README.md', 'utf-8');
var markdownReadMe = marked(readMe);

fs.writeFileSync('generated/README.html', markdownReadMe);