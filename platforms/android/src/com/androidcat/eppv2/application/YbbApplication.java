package com.androidcat.eppv2.application;

import android.app.Application;

import cn.jpush.android.api.JPushInterface;

public class YbbApplication extends Application{
    private static YbbApplication JepayApp;

    @Override
    public void onCreate() {
        super.onCreate();
        JepayApp  = this;

        //初始化推送
        JPushInterface.setDebugMode(true);
        JPushInterface.init(YbbApplication.this);
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
    }
}
