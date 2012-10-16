var fs = require('fs'),
	ztool = require('./ztool');

var readConfig = function(configFile){
	var content = fs.readFileSync(configFile).toString();
    var config = JSON.parse(content);
    return config;
}

var pickupJs = function(url){
	var content = fs.readFileSync(url).toString();
	var reg = /<script\s+.*?src="?([^"]+)"?[^>]+>/gi;
	var jss = [];
	content.replace(reg, function(m, u1){
		jss.push(u1);
	});
	// console.log(jss);
	return jss;
}

var pickupCss = function(url){
	var content = fs.readFileSync(url).toString();
	var reg = /<link\s+.*?href="?([^"]+)"?[^>]+>/gi;
	var attReg = /rel="?\bstylesheet\b"?/i;
	var csss = [];
	content.replace(reg, function(m, u1){
		if(attReg.test(m)){
			csss.push(u1);
		}
	});
	console.log(csss);
	return csss;
}

var pickupImg = function(url){
	console.log(url);
	var content = fs.readFileSync(url).toString();
	var reg = /url\("?([^")]+)"\)/gi;
	var imgs = [];
	content.replace(reg, function(m, u1){
			imgs.push(u1);
	});
	console.log(imgs);
	return imgs;
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
				imgs = pickupImg(css.replace(config.linkPrefix, ''));
				list.splice(list.length, 0, imgs);
			}
		}
		//创建 manifest 
		writeManifest(name, list);
	}
}