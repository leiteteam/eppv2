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

import android.os.Bundle;
import android.util.Log;

import com.androidcat.acnet.okhttp.MyOkHttp;
import com.androidcat.acnet.okhttp.callback.RawResponseHandler;
import com.androidcat.utilities.GsonUtil;
import com.dothantech.printer.IDzPrinter;

public class MainActivity extends LocationActivity  {

  private boolean hasUpdateChecked = false;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    Log.e("onCreate", "----MainActivity onCreate----");
    super.onCreate(savedInstanceState);
    //Utils.fullScreen(this);
    checkUpdate();
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
  }
}
