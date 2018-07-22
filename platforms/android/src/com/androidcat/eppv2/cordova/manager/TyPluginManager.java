package com.androidcat.eppv2.cordova.manager;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Base64;

import com.androidcat.acnet.okhttp.MyOkHttp;
import com.androidcat.acnet.okhttp.callback.RawResponseHandler;
import com.androidcat.utilities.GsonUtil;
import com.androidcat.eppv2.MainActivity;
import com.androidcat.eppv2.persistence.JepayDatabase;
import com.androidcat.eppv2.persistence.bean.KeyValue;
import com.androidcat.eppv2.ui.MyWebBrowserActivity;
import com.androidcat.eppv2.utils.Utils;
import com.androidcat.eppv2.utils.log.LogUtil;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by androidcat on 2017/11/20.
 */

public class TyPluginManager {

  //用户登陆交互
  public static void userLogin(final Context context, final String message, final CallbackContext callbackContext) {
    //add other common processing here
//            if (/*"USER_LOGIN"*/"merUserApi|merUserLogin".equals(actionName)) {
//              String userId = dataObj.optString(/*"USERID"*/"USER_NAME");
//              //用户登录成功后，以用户名为唯一标识设置推送tag
//              Set<String> tags = new HashSet<String>();
//              tags.add(userId);
//              JPushInterface.setTags(context, 2, tags);
//            }
  }

  //通用post
  public static void post(final Context context, final String message, final CallbackContext callbackContext) {
    try {
      JSONObject jsonObject = new JSONObject(message);
      String actionInfo = jsonObject.optString("postData");
      String url = jsonObject.optString("url");

      //将actionInfo加密再传输
      String params = actionInfo;

      LogUtil.e("request:"+params);
      MyOkHttp.getInstance().post().url(url).jsonParams(params).tag(context).enqueue(new RawResponseHandler() {
        @Override
        public void onSuccess(int statusCode, String response) {
          if (!GsonUtil.isJson(response)){
            callbackContext.error("解析信息出错");
            return;
          }
          if (com.androidcat.utilities.Utils.isNull(response)){
            callbackContext.error("服务端返回信息为空");
            return;
          }
          callbackContext.success(response);
        }

        @Override
        public void onStart(int code) {
          //do nothing...
        }

        @Override
        public void onFailure(int statusCode, String error_msg) {
          callbackContext.error(error_msg);
        }
      });
    } catch (JSONException e) {
      e.printStackTrace();
      callbackContext.error("解析信息出错");
    }
  }

  //通用get
  public static void get(final Context context, final String message, final CallbackContext callbackContext) {

  }

  //通用缓存存储
  public static void saveString(final Context context, final String message, final CallbackContext callbackContext) {
    try {
      JSONObject jsonObject = new JSONObject(message);
      String key = jsonObject.optString("key");
      String value = jsonObject.optString("data");
      KeyValue keyValue = new KeyValue();
      keyValue.key = key;
      keyValue.value = value;
      keyValue.time = System.currentTimeMillis();
      JepayDatabase database = JepayDatabase.getInstance(context);
      if (database.saveCacheData(keyValue)) {
        callbackContext.success();
      } else {
        callbackContext.error("数据保存失败");
      }
    } catch (JSONException e) {
      e.printStackTrace();
      callbackContext.error("解析缓存信息出错");
    }
  }

  //通用缓存读取
  public static void getString(final Context context, final String message, final CallbackContext callbackContext) {
    JepayDatabase database = JepayDatabase.getInstance(context);
    String value = database.getCacheData(message);
    if (value == null) {
      callbackContext.success("");
    } else {
      callbackContext.success(value);
    }
  }

  public static void uploadFileWithBase64String(Activity activity, final String message, final CallbackContext callbackContext) {
    try {
      JSONObject jsonObject = new JSONObject(message);
      String url = jsonObject.optString("url");
      String base64String = jsonObject.optString("base64String");
      //String fileType = jsonObject.optString("fileType");
      String fileName = "myFile.jpeg";

      byte[] bytes = Base64.decode(base64String, Base64.DEFAULT);// 将字符串转换为byte数组

      RequestBody fileBody = RequestBody.create(MediaType.parse("multipart/form-data"),bytes);
      MultipartBody mBody = new MultipartBody.Builder()
        .setType(MultipartBody.FORM)
        .addFormDataPart("file",fileName,fileBody)
        .build();

        /* 下边的就和post一样了 */
      OkHttpClient client = new OkHttpClient().newBuilder()
        .connectTimeout(25, TimeUnit.SECONDS)
        .writeTimeout(25, TimeUnit.SECONDS)
        .readTimeout(25, TimeUnit.SECONDS)
        .build();
      Request request = new Request.Builder()
        .url(url)
        .post(mBody)
        .build();
      LogUtil.e("onStart", "Start UpLoad");
      client.newCall(request).enqueue(new Callback() {
        public void onResponse(Call call, Response response) throws IOException {
          if (response.isSuccessful()) {
            final String bodyStr = response.body().string();
            LogUtil.e(bodyStr);
            callbackContext.success(bodyStr);
          }else {
            LogUtil.e(response.message());
            callbackContext.error(response.message());
          }

        }

        public void onFailure(Call call, final IOException e) {
          LogUtil.e(e.getMessage());
          callbackContext.error(e.getMessage());
        }
      });
    } catch (JSONException e) {
      e.printStackTrace();
      LogUtil.e(e.getMessage());
      callbackContext.error(e.getMessage());
    }
  }

  public static void push(CordovaPlugin plugin, final String message, final CallbackContext callbackContext, final CordovaWebView webView){
    try {
      JSONObject jsonObject = new JSONObject(message);
      String code = jsonObject.optString("command");

      if ("webView".equals(code)){
        String url = jsonObject.optString("commandData");
        Intent intent = new Intent(plugin.cordova.getActivity(), MyWebBrowserActivity.class);
        intent.putExtra("url",url);
        plugin.cordova.getActivity().startActivity(intent);
        callbackContext.success();
      }
      else if ("telephone".equals(code)){
        String number = jsonObject.optString("commandData");
        Utils.call(plugin.cordova.getActivity(),number);
        callbackContext.success();
      }
      else if ("location".equals(code)){
        MainActivity mainActivity = (MainActivity) plugin.cordova.getActivity();
        JSONObject job = new JSONObject();
        job.put("alt",mainActivity.alt);
        job.put("lat",mainActivity.lat);
        job.put("lng",mainActivity.lng);
        job.put("province",mainActivity.province);
        job.put("county",mainActivity.county);
        job.put("street",mainActivity.street);
        job.put("address",mainActivity.address);
        callbackContext.success(job.toString());
      }
      else if ("platform.ready".equals(code)){
        plugin.cordova.getActivity().runOnUiThread(new Runnable() {
          public void run() {
            webView.postMessage("splashscreen", "hide");
          }
        });
      }
      else if ("printInit".equals(code)){
        PluginCoreWorker.init(plugin,callbackContext);
      }
      else if ("print".equals(code)){
        String data = jsonObject.optString("commandData");
        PluginCoreWorker.print(data,callbackContext);
      }
    } catch (JSONException e) {
      e.printStackTrace();
      callbackContext.error("解析缓存信息出错");
    }
  }
}
