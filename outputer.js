// [导出]
exports.output = output;

// [模块]
var format = require('util').format;

/*
	名称：输出函数
	参数：
	1、tree：节点树的根节点
	返回值：
	如果解析失败返回 false（布尔类型）
	如果解析成功返回生成的字符串

	函数行为说明：
	本函数能够根据番茄酱(Ketchup)语言的AST语法树生成对应的 html5 字符串
*/
function output(tree) {
	return outputNode(tree);

	function outputNode(node) {
		debugger;
		var nodeStr = tag(node.name, contentCallback);
		return nodeStr;

		function contentCallback() {
			var buffer = '';
			if (node.children && node.children.length > 0) {
				for (var i = 0, len = node.children.length; i < len; ++i) {
					var child = node.children[i];
					buffer += tag(child.name);
				}
			}
			return buffer;
		}
	}

	function tag(name, contentCallback) {
		var content;
		
		name = name || '';
		if (contentCallback) {
			content = contentCallback();
		}
		content = content || '';

		return format('<%s>%s</%s>', name, content, name);
	}
}