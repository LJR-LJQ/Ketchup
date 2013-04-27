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
function parse(inputStr) {
	// TODO
	return false;
}