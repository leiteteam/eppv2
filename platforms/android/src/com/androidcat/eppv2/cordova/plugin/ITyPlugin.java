package com.androidcat.eppv2.cordova.plugin;

import org.apache.cordova.CallbackContext;

public interface ITyPlugin {
    //add auto generated method
    void coolMethod(String message, CallbackContext callbackContext);

    //用户登录接口
    void userLogin(String message, CallbackContext callbackContext);

    //网络post请求
    void post(String message, CallbackContext callbackContext);

    //网络get请求
    void get(String message, CallbackContext callbackContext);

    //取缓存字符串
    void getString(String message, CallbackContext callbackContext);

    //保存字符串数据到缓存
    void saveString(String message, CallbackContext callbackContext);

    //暂定界面跳转方法
    void push(String message, CallbackContext callbackContext);

    //取缓存字符串
    void uploadfileWithBase64String(String message, CallbackContext callbackContext);
}
