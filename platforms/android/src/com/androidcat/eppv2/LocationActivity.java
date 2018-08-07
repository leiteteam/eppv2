package com.androidcat.eppv2;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.androidcat.eppv2.persistence.JepayDatabase;
import com.androidcat.eppv2.persistence.bean.Track;
import com.androidcat.eppv2.utils.Utils;

import org.json.JSONObject;

/**
 * Created by androidcat on 2018/7/2.
 */

public class LocationActivity extends CheckPermissionActivity implements AMapLocationListener {

  private boolean currentGPSState;
  private AMapLocationClient locationClient = null;
  private AMapLocationClientOption locationOption = new AMapLocationClientOption();
  private LocationManager locationManager;

  public static String province;
  public static String county;
  public static String street;
  public static String address;
  public static String lat = "";
  public static String lng = "";
  public static String alt = "0.00";

  public static String doingTaskId = "";
  public static String doingUserId = "";
  public static boolean tracing = false;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    initLocationService();
  }

  @Override
  protected void onResume() {
    super.onResume();
    if (locationClient != null) {
      locationClient.startLocation();
    }
  }

  @Override
  protected void onPause() {
    super.onPause();
    if (locationClient != null) {
      locationClient.stopLocation();
    }
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    if (locationClient != null) {
      locationClient.stopLocation();
      locationClient.onDestroy();

    }
    locationClient = null;
  }

  private void initLocationService(){
    //获取定位服务
    locationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
    currentGPSState = isGpsOpen();

    //初始化client
    locationClient = new AMapLocationClient(this);
    //设置定位参数
    locationClient.setLocationOption(getDefaultOption());
    // 设置定位监听
    locationClient.setLocationListener(this);
  }

  /**
   * 默认的定位参数
   *
   * @author hongming.wang
   * @since 2.8.0
   */
  private AMapLocationClientOption getDefaultOption() {
    locationOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);//可选，设置定位模式，可选的模式有高精度、仅设备、仅网络。默认为高精度模式
    locationOption.setInterval(60000);
    locationOption.setNeedAddress(true);//可选，设置是否返回逆地理地址信息。默认是true
    locationOption.setOnceLocation(false); //可选，设置是否等待wifi刷新，默认为false.如果设置为true,会自动变为单次定位，持续定位时不要使用
    locationOption.setLocationCacheEnable(true); //可选，设置是否使用缓存定位，默认为true
    return locationOption;
  }

  private boolean isGpsOpen() {
    boolean gpsStatus;
    gpsStatus = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    if (gpsStatus) {
      return true;
    }
    return false;
  }

  @Override
  public void onLocationChanged(AMapLocation aMapLocation) {
    if (aMapLocation != null && aMapLocation.getErrorCode() == 0) {
      province = aMapLocation.getProvince();
      county = aMapLocation.getDistrict();
      street = aMapLocation.getStreet();
      address = aMapLocation.getAddress();
      if (aMapLocation.getLongitude() > 75 && aMapLocation.getLongitude() < 135){
        lng = aMapLocation.getLongitude() + "";
        if (lng.length() > 9){
          lng = lng.substring(0,9);
        }
      }
      if (aMapLocation.getLatitude() > 3 && aMapLocation.getLatitude() < 54){
        lat = aMapLocation.getLatitude() + "";
        if (lat.length() > 9){
          lat = lat.substring(0,9);
        }
      }
      if (aMapLocation.getAltitude() > 0){
        alt = aMapLocation.getAltitude() + "";
      }

      trace();
      Log.e("Amap", "onLocationChanged:"+county+address+"--lng:"+lng+"--lat:"+lat+"--alt:"+alt);
    } else {
      String errText = "定位失败," + aMapLocation.getErrorCode() + ": "
        + aMapLocation.getErrorInfo();
      Log.e("AmapErr", errText);
    }
  }

  private void trace(){
    if (!tracing){
      return;
    }
    if (Utils.isNull(doingTaskId) || Utils.isNull(doingUserId)){
      return;
    }
    Track track = new Track();
    track.taskid = doingTaskId;
    track.userid = doingUserId;
    track.lat = lat;
    track.lng = lng;
    track.time = System.currentTimeMillis();

    JepayDatabase database = JepayDatabase.getInstance(this);
    database.savePoint(track);
  }
}
