package com.androidcat.eppv2.cordova.manager;

import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.view.View;

import com.amap.api.maps.MapsInitializer;
import com.amap.api.maps.model.LatLng;
import com.amap.api.maps.model.Poi;
import com.amap.api.navi.AmapNaviPage;
import com.amap.api.navi.AmapNaviParams;
import com.amap.api.navi.AmapNaviType;
import com.amap.api.navi.INaviInfoCallback;
import com.amap.api.navi.model.AMapNaviLocation;
import com.androidcat.acnet.entity.User;
import com.androidcat.eppv2.CheckPermissionActivity;
import com.androidcat.eppv2.LocationActivity;
import com.androidcat.eppv2.R;
import com.androidcat.eppv2.cordova.plugin.map.MapNaviUtil;
import com.androidcat.eppv2.cordova.plugin.print.DzPrinterHelper;
import com.androidcat.eppv2.cordova.plugin.qrcode.QrCodeHelper;
import com.androidcat.eppv2.persistence.JepayDatabase;
import com.androidcat.eppv2.persistence.bean.TaskData;
import com.androidcat.eppv2.persistence.bean.UserInfo;
import com.androidcat.utilities.GsonUtil;
import com.androidcat.utilities.SystemSettingUtil;
import com.androidcat.utilities.Utils;
import com.androidcat.utilities.permission.AndPermission;
import com.androidcat.utilities.permission.Permission;
import com.flyco.animation.FlipEnter.FlipVerticalSwingEnter;
import com.flyco.dialog.listener.OnBtnClickL;
import com.flyco.dialog.widget.NormalDialog;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
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
    // 设置应用单独的地图存储目录
    //MapsInitializer.sdcardDir = plugin.cordova.getActivity().getFilesDir().getAbsolutePath()+ File.pathSeparator+"aMap";
    plugin.cordova.getActivity().startActivity(new Intent(plugin.cordova.getActivity().getApplicationContext(),
      com.amap.api.maps.offlinemap.OfflineMapActivity.class));
    callbackContext.success();
  }

  /**
   * 用于处理二维码生成或识别的接口.
   *
   * @param plugin          连接此接口的插件
   * @param callbackContext 回调函数句柄；向js返回数据靠此
   */
  public static void qrcode(CordovaPlugin plugin, String title, final CallbackContext callbackContext) {
    QrCodeHelper qrCodeHelper = QrCodeHelper.getQrCodeHelper(plugin, callbackContext);
    qrCodeHelper.gotoQrCapture(title);
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

  public static void getUserInfo(CordovaPlugin plugin, String username, final CallbackContext callbackContext) {
    JepayDatabase database = JepayDatabase.getInstance(plugin.cordova.getActivity());
    UserInfo userInfo = database.getUserInfo(username);
    if (userInfo != null){
      callbackContext.success(new Gson().toJson(userInfo));
    }else {
      callbackContext.error("");
    }
  }

  public static void updateUserInfo(CordovaPlugin plugin, String infoStr, final CallbackContext callbackContext) {
    JepayDatabase database = JepayDatabase.getInstance(plugin.cordova.getActivity());
    UserInfo userInfo = new Gson().fromJson(infoStr, UserInfo.class);
    if (database.updateUserInfo(userInfo)){
      callbackContext.success();
    }else {
      callbackContext.error("");
    }
  }

  public static void navigation(CordovaPlugin plugin,String commData, final CallbackContext callbackContext){
    try {
      JSONObject data = new JSONObject(commData);
      String dlat = data.optString("lat");
      String dlon = data.optString("lng");
      if (Utils.isApplicationInstalled(plugin.cordova.getActivity(),"com.autonavi.minimap")){
        MapNaviUtil.openGaoDeMap(plugin.cordova.getActivity(),"","","",dlat,dlon,"");
        callbackContext.success();
        return;
      }

      double lat = Double.parseDouble(dlat);
      double lng = Double.parseDouble(dlon);
      LatLng dst = new LatLng(lat,lng);
      //Poi start = new Poi("三元桥", new LatLng(39.96087,116.45798), "");

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

  public static void startTracing(final CordovaPlugin plugin, String taskid, final CallbackContext callbackContext) {
    if (!Utils.isGpsOpen(plugin.cordova.getActivity())){
      final NormalDialog dialog = new NormalDialog(plugin.cordova.getActivity());
      dialog.content("您尚未开启Gps开关，导航和记录需开启Gps。请前往开启")
        .contentTextColor(R.color.text_black)
        .title("")
        .btnNum(1)
        .btnText("好的") //
        .style(NormalDialog.STYLE_TWO)//
        .showAnim(new FlipVerticalSwingEnter())//
        .show();
      dialog.setOnBtnClickL(new OnBtnClickL() {
        @Override
        public void onBtnClick() {
          Utils.openGPS(plugin.cordova.getActivity());
          dialog.dismiss();
        }
      });
      callbackContext.error("");
      return;
    }

    JepayDatabase database = JepayDatabase.getInstance(plugin.cordova.getActivity());
    LocationActivity.doingUserId = database.getCacheData("username");
    LocationActivity.doingTaskId = taskid;
    LocationActivity.tracing = true;
    callbackContext.success();
  }

  public static void stopTracing(final CordovaPlugin plugin, String taskid, final CallbackContext callbackContext) {

    JepayDatabase database = JepayDatabase.getInstance(plugin.cordova.getActivity());
    LocationActivity.doingUserId = "";
    LocationActivity.doingTaskId = "";
    LocationActivity.tracing = false;
    if (database.updateTaskDataWithTrack(taskid)){
      callbackContext.success();
    }else {
      callbackContext.error("");
    }
  }
}
