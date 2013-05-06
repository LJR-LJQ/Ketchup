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
	console.log(rootNode.children[0].children);
	return rootNode;

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

			spaceCount = getSpaceCount(firstLineStr, function(outputStr){
				firstLineStr = outputStr;
			});

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
			length;

		// [流程]
		length = inputStr.length;
		for(var i = 0; i < length; i++) {
			if(inputStr.charAt(i) == '\n') break;
		}
		outputStr = inputStr.slice(i + 1, length);
		if(callback != null) callback(outputStr);
		return inputStr.slice(0, i + 1).replace(/[\r\n]/g, '');
	}

	function getSpaceCount(inputStr, callback) {
		// [变量]
		var outputStr,
			length;

		// [流程]
		length = inputStr.length;
		for(var i = 0; i < length; i++) {
			if(inputStr.charAt(i) != ' ') {
				outputStr = inputStr.slice(i, length);
				if(callback != null) callback(outputStr);
				return i;
			}
		}
	}

	function parseLineToNode(inputStr) {
		// [变量]
		var node,
			length;

		// [流程]
		node = {
			name: '',
			attribute: {},
			text: '',
			children: []
		};

		// 提取标签名字
		length = inputStr.length;
		for(var i = 0; i < inputStr.length; i++) {
			var c = inputStr.charAt(i);
			if(!(isAlpha(c) || isUnderline(c))) break;
		}
		node.name = inputStr.slice(0, i);
		// 下面分析标签属性，比较复杂，暂时写到这
		inputStr = inputStr.slice(i, length);
		length = inputStr.length;
		return node;
	}

	// [函数]
	function isAlpha(cCheck) {
		return ((('a'<=cCheck) && (cCheck<='z')) || (('A'<=cCheck) && (cCheck<='Z')));
	}

	function isUnderline(cCheck) {
		return ('_' == cCheck);
	}
}