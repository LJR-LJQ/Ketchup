// [模块]
var fs = require('fs'),
	path = require('path'),
	parser = require('./parser.js'),
	outputer = require('./outputer.js');

// [变量]
var inputFileName,
	outputFileName;

var inputFileContent,
	outputFileContent;

var arguments,
	fsRealPath,
	argRealPath;

// [流程]
inputFileName = 'input.txt';
outputFileName = 'output.html';
arguments = process.argv;
fsRealPath = fs.realpathSync('.');
for(var i = 1; i < arguments.length; i++) {
	argRealPath = path.normalize(arguments[i]);
	argRealPath = path.dirname(argRealPath);
	if(argRealPath == fsRealPath) {
		arguments = arguments.splice(i + 1);
		break;
	}
}
inputFileName = typeof arguments[0] == 'undefined' ? '' : arguments[0];
outputFileName = typeof arguments[1] == 'undefined' ? inputFileName : arguments[1];
if(outputFileName.indexOf('.html') < 0) outputFileName += '.html';
console.log(inputFileName);
console.log(outputFileName);

if (!fs.existsSync(inputFileName)) {
	console.log('文件不存在：' + inputFileName);
	return;
}

inputFileContent = fs.readFileSync(inputFileName, {encoding: 'utf8'});
outputFileContent = outputer.output(parser.parse(inputFileContent));

if (outputFileContent === false) {
	console.log('解析失败');
	return;
}

fs.writeFileSync(outputFileName, outputFileContent);
console.log('解析成功，结果已经保存到：' + outputFileName);