exports.toTokenGroupList = toTokenGroupList;

function toTokenGroupList(tokenList) {
	var tokenGroupList = [],
		group = [],
		token;

	if (tokenList.length < 1) {
		return tokenGroupList;
	}

	// 其实就是以空格和换行为分割标准来分组
	for (var i = 0, len = tokenList.length; i < len; ++i) {
		token = tokenList[i];
		if (token.type === 'space' || token.type === 'return') {
			if (group.length > 0) {
				tokenGroupList.push(group);
				group = [];
			}
		} else {
			group.push(token);
		}
	}

	// 不要漏了最后一组
	if (group.length > 0) {
		tokenGroupList.push(group);
		group = [];
	}

	// 返回结果
	return tokenGroupList;
}