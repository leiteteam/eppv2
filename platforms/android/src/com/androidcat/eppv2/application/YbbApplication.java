package com.androidcat.eppv2.application;

import android.os.Bundle;

import com.androidcat.utilities.log.AndroidLogTool;
import com.androidcat.utilities.log.LogFileTool;
import com.androidcat.utilities.log.LogLevel;
import com.androidcat.utilities.log.Logger;
import com.androidcat.utilities.persistence.CacheFileManager;
import com.androidcat.utilities.persistence.SharePreferencesUtil;
import com.tencent.bugly.crashreport.CrashReport;

import cn.jpush.android.api.JPushInterface;

public class YbbApplication extends CrashReportingApplication {
  private static YbbApplication JepayApp;

  @Override
  public void onCreate() {
    super.onCreate();
    JepayApp = this;
    CrashReport.initCrashReport(getApplicationContext(), "9c83bc10d6", true);
    //初始化缓存Context
    initSharePreference();
    //初始化日志工具
    initLogger();        //初始化推送
    JPushInterface.setDebugMode(true);
    JPushInterface.init(YbbApplication.this);
  }

  private void initSharePreference(){
    CacheFileManager.init(YbbApplication.this);
    SharePreferencesUtil.init(this);
  }

  private void initLogger() {
    Logger.init(Logger.DEFAULT_TAG,this)        // default PRETTYLOGGER or use just init()
      .methodCount(4)                 // default 2
      .logLevel(LogLevel.FULL)        // default LogLevel.FULL
      .methodOffset(0)                // default 0
      .logTool(new AndroidLogTool()); // custom log tool, optional
    LogFileTool.getInstance().ensureCacheDir();
  }

  @Override
  public String getReportUrl() {
    return null;
  }

  @Override
  public Bundle getCrashResources() {
    return null;
  }

  @Override
  public void onTerminate() {
    super.onTerminate();
  }
}
