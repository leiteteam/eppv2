package com.androidcat.eppv2.cordova.manager;

import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.view.View;

import com.amap.api.maps.model.LatLng;
import com.amap.api.maps.model.Poi;
import com.amap.api.navi.AmapNaviPage;
import com.amap.api.navi.AmapNaviParams;
import com.amap.api.navi.AmapNaviType;
import com.amap.api.navi.INaviInfoCallback;
import com.amap.api.navi.model.AMapNaviLocation;
import com.androidcat.eppv2.cordova.plugin.print.DzPrinterHelper;
import com.androidcat.eppv2.cordova.plugin.qrcode.QrCodeHelper;
import com.androidcat.eppv2.persistence.JepayDatabase;
import com.androidcat.eppv2.persistence.bean.TaskData;
import com.androidcat.utilities.GsonUtil;
import com.androidcat.utilities.SystemSettingUtil;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by androidcat on 2018/7/22.
 */

public class PluginCoreWorker {

  public static void print(final String message, final CallbackContext callbackContext) {
    DzPrinterHelper printerHelper = new DzPrinterHelper();
    if (printerHelper.isPrinterConnected()) {
      if (printerHelper.print2dBarcode(message, printerHelper.getPrintParam(1, 0))) {
        callbackContext.success("打印成功");
      } else {
        callbackContext.error("打印失败，请确保打印设备连接无误后再试");
      }
    } else {
      callbackContext.error("打印机尚未连接，请确保打印设备连接正常后再试");
    }
  }

  public static void isPrintAvailable(final CordovaPlugin plugin, final CallbackContext callbackContext) {
    DzPrinterHelper printerHelper = new DzPrinterHelper();
    if (printerHelper.isPrinterConnected()) {
      callbackContext.success("已连接");
    }else {
      callbackContext.success("未连接");
    }
  }

  public static void init(final CordovaPlugin plugin, final CallbackContext callbackContext) {
    DzPrinterHelper printerHelper = new DzPrinterHelper();
    printerHelper.init(plugin.cordova.getActivity(), callbackContext);
  }

  public static void openOfflineMap(final CordovaPlugin plugin, final CallbackContext callbackContext) {
    //在Activity页面调用startActvity启动离线地图组件
    plugin.cordova.getActivity().startActivity(new Intent(plugin.cordova.getActivity(),
      com.amap.api.maps.offlinemap.OfflineMapActivity.class));
    callbackContext.success();
  }

  /**
   * 用于处理二维码生成或识别的接口.
   *
   * @param plugin          连接此接口的插件
   * @param callbackContext 回调函数句柄；向js返回数据靠此
   */
  public static void qrcode(CordovaPlugin plugin, final CallbackContext callbackContext) {
    QrCodeHelper qrCodeHelper = QrCodeHelper.getQrCodeHelper(plugin, callbackContext);
    qrCodeHelper.gotoQrCapture();
  }

  public static void downloadTask(CordovaPlugin plugin, String tasksJson, final CallbackContext callbackContext) {
    try {
      List<TaskData> taskList = new Gson().fromJson(tasksJson,new TypeToken<List<TaskData>>() {}.getType());
      JepayDatabase database = JepayDatabase.getInstance(plugin.cordova.getActivity());
      if (database.updateTaskDataList(taskList)){
        callbackContext.success();
      }else {
        callbackContext.error("数据缓存失败");
      }
    } catch (Exception e) {
      e.printStackTrace();
      callbackContext.error("数据缓存失败");
    }
  }

  public static void countTask(CordovaPlugin plugin, String username, final CallbackContext callbackContext) {
    JepayDatabase database = JepayDatabase.getInstance(plugin.cordova.getActivity());
    JSONObject jsonObject = new JSONObject();
    try {
      jsonObject.put("undoneCountNum",database.getUndoneTaskCount(username));
      jsonObject.put("doneCountNum",database.getDoneTaskCount(username));
      callbackContext.success(jsonObject);
    } catch (JSONException e) {
      e.printStackTrace();
      callbackContext.error("");
    }

  }

  public static void getUndoneTaskList(CordovaPlugin plugin, String username, final CallbackContext callbackContext) {
    JepayDatabase database = JepayDatabase.getInstance(plugin.cordova.getActivity());
    List<TaskData> list = database.getUndoneTaskList(username);
    JSONArray jsonArray = new JSONArray();
    for (TaskData data : list){
      String json = new Gson().toJson(data);
      jsonArray.put(json);
    }
    callbackContext.success(jsonArray);
  }

  public static void getDoneTaskList(CordovaPlugin plugin, String username, final CallbackContext callbackContext) {
    JepayDatabase database = JepayDatabase.getInstance(plugin.cordova.getActivity());
    List<TaskData> list = database.getDoneTaskList(username);
    JSONArray jsonArray = new JSONArray();
    for (TaskData data : list){
      String json = new Gson().toJson(data);
      jsonArray.put(json);
    }
    callbackContext.success(jsonArray);
  }

  public static void updateTaskDataToUploaded(CordovaPlugin plugin, String listStr, final CallbackContext callbackContext) {
    JepayDatabase database = JepayDatabase.getInstance(plugin.cordova.getActivity());
    List<String> taskidList = new Gson().fromJson(listStr,new TypeToken<List<String>>(){}.getType());
    if(database.updateTaskDataToUploaded(taskidList)){
      callbackContext.success();
    }else {
      callbackContext.error("本地数据更新失败,请重新上传");
    }
  }

  public static void saveSample(CordovaPlugin plugin, String dataStr, final CallbackContext callbackContext) {
    JepayDatabase database = JepayDatabase.getInstance(plugin.cordova.getActivity());
    TaskData taskData = new Gson().fromJson(dataStr,new TypeToken<TaskData>(){}.getType());
    if(database.updateTaskData(taskData)){
      callbackContext.success();
    }else {
      callbackContext.error("本地数据更新失败,请重新保存");
    }
  }

  public static void navigation(CordovaPlugin plugin,String commData, final CallbackContext callbackContext){
    try {
      JSONObject data = new JSONObject(commData);
      double lat = Double.parseDouble(data.optString("lat"));
      double lng = Double.parseDouble(data.optString("lng"));
      LatLng dst = new LatLng(lat,lng);
      //Poi start = new Poi("三元桥", new LatLng(39.96087,116.45798), "");
      /**终点传入的是北京站坐标,但是POI的ID "B000A83M61"对应的是北京西站，所以实际算路以北京西站作为终点**/
      Poi end = new Poi("目的地", dst, "");
      AmapNaviPage.getInstance().showRouteActivity(plugin.cordova.getActivity(), new AmapNaviParams(null, null, end, AmapNaviType.DRIVER), new INaviInfoCallback() {
        @Override
        public void onInitNaviFailure() {

        }

        @Override
        public void onGetNavigationText(String s) {

        }

        @Override
        public void onLocationChange(AMapNaviLocation aMapNaviLocation) {

        }

        @Override
        public void onArriveDestination(boolean b) {

        }

        @Override
        public void onStartNavi(int i) {

        }

        @Override
        public void onCalculateRouteSuccess(int[] ints) {

        }

        @Override
        public void onCalculateRouteFailure(int i) {

        }

        @Override
        public void onStopSpeaking() {

        }

        @Override
        public void onReCalculateRoute(int i) {

        }

        @Override
        public void onExitPage(int i) {

        }

        @Override
        public void onStrategyChanged(int i) {

        }

        @Override
        public View getCustomNaviBottomView() {
          return null;
        }

        @Override
        public View getCustomNaviView() {
          return null;
        }

        @Override
        public void onArrivedWayPoint(int i) {

        }
      });
      callbackContext.success();
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public static void getWifiState(CordovaPlugin plugin, final CallbackContext callbackContext){
    if (SystemSettingUtil.isWifiAvailable(plugin.cordova.getActivity())){
      callbackContext.success(1);
    }else {
      callbackContext.success(0);
    }
  }

  public static void get4gState(CordovaPlugin plugin, final CallbackContext callbackContext){
    if (SystemSettingUtil.is4GAvailable(plugin.cordova.getActivity())){
      callbackContext.success(1);
    }else {
      callbackContext.success(0);
    }
  }

  public static void getBleState(CordovaPlugin plugin, final CallbackContext callbackContext){
    if (SystemSettingUtil.isBleAvailable()){
      callbackContext.success(1);
    }else {
      callbackContext.success(0);
    }
  }

  public static void switchWifi(CordovaPlugin plugin, final CallbackContext callbackContext){
    SystemSettingUtil.switchWifi(plugin.cordova.getActivity());
    callbackContext.success();
  }

  public static void switch4g(CordovaPlugin plugin, final CallbackContext callbackContext){
    SystemSettingUtil.switch4g(plugin.cordova.getActivity());
    callbackContext.success();
  }

  public static void switchBle(CordovaPlugin plugin, final CallbackContext callbackContext){
    SystemSettingUtil.switchBle();
    callbackContext.success();
  }
}
