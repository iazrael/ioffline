var fs = require('fs'),
	ztool = require('./ztool');

var readConfig = function(configFile){
	var content = fs.readFileSync(configFile).toString();
    content = content.replace(/\/\*[\s\S]*?\*\/|\/\/.+/g, '')
    var config = JSON.parse(content);
    return config;
}

var pickupJs = function(url){
	var content = fs.readFileSync(url).toString();
	var reg = /<script\s+.*?src="?([^"]+)"?[^>]+>/gi;
	var match = content.match(reg);
	console.log(match);
	return [];
}

var pickupCss = function(url){
	return [];
}

var pickupImg = function(url){
	return [];
}

var writeManifest = function(name, list){

}

/**
 * 入口函数
 * @param  {String} configFile 
 */
exports.generate = function(configFile){
	// 读取配置
	var config = readConfig(configFile);
	var htmls, csss, jss, imgs, list;
	for(var name in config){
		list = [];
		htmls = config[name];
		for(var i = 0, html; html = htmls[i]; i++) {
			// 收集 html
			list.push(html);
			// 收集 js
			jss = pickupJs(html);
			list.splice(list.length, 0, jss);
			// 收集 css
			csss = pickupCss(html);
			list.splice(list.length, 0, csss);
			// 收集 css 里面的图片
			for(var j = 0, css; css = csss[j]; j++) {
				imgs = pickupImg(css);
				list.splice(list.length, 0, imgs);
			}
		}
		//创建 manifest 
		writeManifest(name, list);
	}
}