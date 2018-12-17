/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.androidcat.eppv2;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.androidcat.acnet.okhttp.MyOkHttp;
import com.androidcat.acnet.okhttp.callback.RawResponseHandler;
import com.androidcat.utilities.GsonUtil;
import com.androidcat.utilities.LogUtil;
import com.dothantech.printer.IDzPrinter;

import org.json.JSONObject;

public class MainActivity extends LocationActivity  {

  private boolean hasUpdateChecked = false;
  private static final int REQUEST_CODE1 = 1001;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    Log.e("onCreate", "----MainActivity onCreate----");
    super.onCreate(savedInstanceState);
    super.init();
    LogUtil.d(TAG, "onCreate launchUrl1 = " + launchUrl);

    // enable Cordova apps to be started in the background
    Bundle extras = getIntent().getExtras();
    if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
      moveTaskToBack(true);
    }
    loadUrl(launchUrl);
    //register native event broadcast receiver
    registerEventReceiver();
    checkUpdate();
    requestPermission();
  }

  private void checkUpdate(){
    String url = "";
    String params = "{}";
    MyOkHttp.getInstance().post().url(url).jsonParams(params).tag(this).enqueue(new RawResponseHandler() {
      @Override
      public void onSuccess(int statusCode, String response) {
        if (!GsonUtil.isJson(response)){
          hasUpdateChecked = true;
          Log.e("onFailure", "解析信息出错");
          return;
        }
        if (com.androidcat.utilities.Utils.isNull(response)){
          hasUpdateChecked = true;
          Log.e("onFailure", "服务端返回信息为空");
          return;
        }
        showUpdateDialog();
      }

      @Override
      public void onStart(int code) {
        //do nothing...
      }

      @Override
      public void onFailure(int statusCode, String error_msg) {
        hasUpdateChecked = true;
        Log.e("onFailure", error_msg);
      }
    });
  }

  public void reload(){
    loadConfig();
    loadUrl(launchUrl);
  }

  private void showUpdateDialog(){

  }

  @Override
  public void onDestroy() {
    // App退出，不再使用打印机进行打印，调用quit()方法结束IDzPrinter对象
    IDzPrinter.Factory.getInstance().quit();
    super.onDestroy();
    unregisterEventReceiver();
  }

  class EventReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
      String eventName = intent.getStringExtra("eventName");
      String data = intent.getStringExtra("data");
      fireWindowEvent(eventName,data);
    }
  }
  private MainActivity.EventReceiver eventReceiver = new MainActivity.EventReceiver();
  private void registerEventReceiver(){
    IntentFilter filter = new IntentFilter();
    filter.addAction("androidcat.nativeEvent");
    this.registerReceiver(eventReceiver,filter);
    Log.e("Amap", "registerEventReceiver");
  }

  private void unregisterEventReceiver(){
    this.unregisterReceiver(eventReceiver);
    Log.e("Amap", "unregisterEventReceiver");
  }

  private void fireWindowEvent(String eventName,Object data){
    String method = "";
    if( data instanceof JSONObject) {
      method = String.format("javascript:cordova.fireWindowEvent('%s', %s );", eventName, data.toString() );
    }
    else  {
      method = String.format("javascript:cordova.fireWindowEvent('%s','%s');", eventName, data.toString() );
    }
    this.appView.loadUrl(method);
  }
  //请求权限
  private void requestPermission() {
    if (Build.VERSION.SDK_INT >= 23) {
      int check = checkSelfPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION);
      if (check != PackageManager.PERMISSION_GRANTED) {
        requestPermissions(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION}, REQUEST_CODE1);
      }
    }
  }
}
