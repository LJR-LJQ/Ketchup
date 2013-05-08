// [导出]
exports.parse = parse;

/*
	名称：语法解析函数
	参数：
	1、inputStr：输入字串
	2、callback：解析完毕后的回调函数
	返回值：
	如果解析失败返回 false（布尔类型）
	如果解析成功返回一个对象，该对象形如： {name: '节点名称', children: [...子节点对象...]}

	函数行为说明：
	本函数能够解析符合番茄酱(Ketchup)语言的字符串并构造出语义等价的AST语法树返回
*/
function parse(inputBuf) {
	// [变量]
	var rootNode,
		inputObj;

	// [流程]
	rootNode = {
		name: 'root',
		children: []
	};
	inputObj = {
		str: inputBuf.toString('utf8', 0, inputBuf.length)
	}
	traverse(rootNode, inputObj, -1);
	return rootNode.children[0];

	// [函数]
	function traverse(root, inputObj, fartherSpaceCount) {
		// [变量]
		var firstLineStr,
			remainStr,
			spaceCount,
			node;

		// [流程]
		while(true) {
			if(inputObj.str.length <= 0) break; // 结束

			firstLineStr = getFirstLine(inputObj.str, function(outputStr){
				remainStr = outputStr;
			});

			spaceCount = getSpaceCount(firstLineStr);

			if(spaceCount > fartherSpaceCount) { // 缩进
				node = parseLineToNode(firstLineStr);
				inputObj.str = remainStr;
				traverse(node, inputObj, spaceCount);
				root.children.push(node);
			} else {
				break;
			}
		}
	}

	function getFirstLine(inputStr, callback) {
		// [变量]
		var outputStr,
			i;

		// [流程]
		for(i = 0; i < inputStr.length; i++) {
			if(inputStr.charAt(i) == '\n') break;
		}
		outputStr = inputStr.substring(i + 1);
		if(callback != null) callback(outputStr);
		return inputStr.substring(0, i + 1).replace(/[\r\n]/g, '');
	}

	function getSpaceCount(inputStr) {
		// [变量]
		var outputStr,
			count,
			cCheck;

		// [流程]
		for(var i = 0, count = 0; i < inputStr.length; i++) {
			cCheck = inputStr.charAt(i);
			if(cCheck == ' ') {
				count++;
			} else if(cCheck == '\t') { // 一个tab相当于四个空格
				count += 4;
			} else {
				break;
			}
		}
		return count;
	}

	function parseLineToNode(inputStr) { // 将一行构造成node
		// [变量]
		var rootNode,
			currentNode,
			preNode,
			lines;

		// [流程]
		lines = splitToLines(inputStr);
		for(var i = 0; i < lines.length; i++) { // 处理行内关系的for循环
			currentNode = parseSentenceToNode(lines[i]);

			if(i == 0) { // 将第一个标签存储好，用作返回
				rootNode = currentNode;
			} else { // 行内关系的嵌套
				preNode.children.push(currentNode);
			}
			preNode = currentNode;
		}
		return rootNode;
	}

	function splitToLines(inputStr) { // 将一行分成多行
		// [变量]
		var indexOfVertical,
			splitRight,
			splitResult;
		// [流程]
		splitResult = inputStr;
		indexOfVertical = inputStr.indexOf(' | '); // 先将行内的TEXT提取出来
		if(indexOfVertical >= 0) {
			splitRight = inputStr.substring(indexOfVertical + 1);
			splitResult = inputStr.substring(0, indexOfVertical);
		}
		splitResult = splitResult.split(' > '); // 对非TEXT部分按‘>’进行分割
		for(var i = 0; i < splitResult.length; i++) { // 处理分割结果，将空白删除
			splitResult[i] = splitResult[i].trim();
			if(splitResult[i] == '') splitResult.splice(i, 1);
		}
		if(typeof splitRight != 'undefined') { // 最后将TEXT插回到结果集中
			splitResult.push(splitRight);
		}
		return splitResult;
	}

	function parseSentenceToNode(inputStr) { // 将一个标签构造成node
		// [变量]
		var indexOfVertical,
			splitResult;

		var name,
			text,
			attributes,
		// [流程]
		name = '';
		text = '';
		attributes = [];
		splitResult = [];
		indexOfVertical = inputStr.indexOf('| ');
		if(indexOfVertical == 0) { // 如果该标签为文本
			name = '|'
			text = inputStr.substring(2);
		} else {
			splitResult = splitToWords(inputStr);
			name = splitResult[0]
			for(var i = 1; i < splitResult.length; i++) { // 处理每个标签的for循环
				attributes.push(splitResult[i]);
			}
		}
		return node(name, attributes, text, []);
	}

	function node(name, attributes, text, children) {
		return {
			name: name,
			attributes: attributes,
			text: text,
			children: children
		};
	}

	function splitToWords(inputStr) { // 忽略引号内的空格，对字符串按空格进行分割
		// [变量]
		var splitResult,
			isInQuotation,
			cCheck,
			preIndex;
		// [流程]
		splitResult = [];
		isInQuotation = false;
		inputStr += ' ';
		preIndex = 0;
		for(var i = 0; i < inputStr.length; i++) {
			cCheck = inputStr.charAt(i);
			if((cCheck == ' ') && !isInQuotation) {
				splitResult.push(inputStr.substring(preIndex, i));
				preIndex = i + 1;
			} else if(cCheck == '\'' || cCheck == '"') {
				isInQuotation = !isInQuotation;

			}
		}
		return splitResult;
	}
}