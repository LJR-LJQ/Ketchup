// [模块]
var fs = require('fs'),
	parser = require('./parser.js'),
	outputer = require('./outputer.js');

// [变量]
var inputFileName,
	outputFileName;

var inputFileContent,
	outputFileContent;

// [流程]
inputFileName = 'input.txt';
outputFileName = 'output.html';

if (!fs.existsSync(inputFileName)) {
	console.log('文件不存在：' + inputFileName);
	return;
}

inputFileContent = fs.readFileSync(inputFileName);
outputFileContent = outputer.output(parser.parse(inputFileContent));

if (outputFileContent === false) {
	console.log('解析失败');
	return;
}

fs.writeFileSync(outputFileName, outputFileContent);
console.log('解析成功，结果已经保存到：' + outputFileName);