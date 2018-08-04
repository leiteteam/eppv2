var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'TYNative', 'coolMethod', [arg0]);
};
exports.userLogin = function (arg0, success, error) {
    exec(success, error, 'TYNative', 'userLogin', [arg0]);
};
exports.post = function (arg0, success, error) {
    exec(success, error, 'TYNative', 'post', [arg0]);
};
exports.get = function (arg0, success, error) {
    exec(success, error, 'TYNative', 'get', [arg0]);
};
exports.getString = function (arg0, success, error) {
    exec(success, error, 'TYNative', 'getString', [arg0]);
};
exports.saveString = function (arg0, success, error) {
    exec(success, error, 'TYNative', 'saveString', [arg0]);
};
exports.uploadfileWithBase64String = function (arg0, success, error) {
    exec(success, error, 'TYNative', 'uploadfileWithBase64String', [arg0]);
};
exports.push = function (arg0, success, error) {
    exec(success, error, 'TYNative', 'push', [arg0]);
};