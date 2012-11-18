var fs = require('fs'),
    path = require('path');

var toString = Object.prototype.toString;

var is = exports.is = function(type, obj) {
    var clas = toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

var isString = exports.isString = function(obj){
    return toString.call(obj) === '[object String]';
}

var isArray = exports.isArray = Array.isArray || function(obj){
    return toString.call(obj) === '[object Array]';
}

var isArguments = exports.isArguments = function(obj){
    return toString.call(obj) === '[object Arguments]';
}

var isObject = exports.isObject = function(obj){
    return toString.call(obj) === '[object Object]';
}

var isFunction = exports.isFunction = function(obj){
    return toString.call(obj) === '[object Function]';
}

var isUndefined = exports.isUndefined = function(obj){
    return toString.call(obj) === '[object Undefined]';
}

/**
 * 合并几个对象并返回 baseObj,
 * 如果 extendObj 有数组属性, 则直接拷贝引用
 * @param {Object} baseObj 基础对象
 * @param {Object} extendObj ... 
 * 
 * @return {Object} baseObj
 * 
 **/
var merge = exports.merge = function(baseObj, extendObj1, extendObj2/*, extnedObj3...*/){
    var argu = arguments;
    var extendObj;
    for(var i = 1; i < argu.length; i++){
        extendObj = argu[i];
        for(var j in extendObj){
            if(isArray(extendObj[j])){
                baseObj[j] = extendObj[j].concat();
            }else if(isObject(extendObj[j])){
                if(baseObj[j] && isArray(baseObj[j])){
                //避免给数组做 merge
                    baseObj[j] = merge({}, extendObj[j]);
                }else{
                    baseObj[j] = merge({}, baseObj[j], extendObj[j]);
                }
            }else{
                baseObj[j] = extendObj[j];
            }
        }
    }
    return baseObj;
}

exports.endsWith = function(str, end){
    var index = str.lastIndexOf(end);
    return index + end.length == str.length;
}

exports.jsonParse = function(jsonStr){
    return Function('return ' + jsonStr)();
}