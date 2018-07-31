package com.androidcat.utilities;

import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.net.Uri;
import android.net.wifi.WifiManager;
import android.telephony.TelephonyManager;

import java.lang.reflect.Method;

/**
 * Created by androidcat on 2018/7/27.
 */

public class SystemSettingUtil {

  public static boolean isWifiAvailable(Context context) {
    WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
    return wifiManager.isWifiEnabled();
  }

  /**
   * 判断当前网络是否是4G网络
   *
   * @param
   * @return boolean
   */
  public static boolean is4GAvailable(Context context) {
    TelephonyManager teleManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    Class[] getArgArray = null;
    Object[] getArgInvoke = null;
    try {
      Method mGetMethod = teleManager.getClass().getMethod("getDataEnabled", getArgArray);
      boolean isOpen = (Boolean) mGetMethod.invoke(teleManager, getArgInvoke);
      return isOpen;
    } catch (Exception e) {
      e.printStackTrace();
    }
    return false;
  }

  public static void switchWifi(Context context){
    //首先，用Context通过getSystemService获取wifimanager
    WifiManager wifiManager = (WifiManager)context.getSystemService(Context.WIFI_SERVICE);
    //调用WifiManager的setWifiEnabled方法设置wifi的打开或者关闭，只需把下面的state改为布尔值即可（true:打开 false:关闭）
    if (wifiManager.isWifiEnabled()) {
      wifiManager.setWifiEnabled(false);
    } else {
      wifiManager.setWifiEnabled(true);
    }
  }

  public static void switch4g(Context context){
    TelephonyManager teleManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    Class[] getArgArray = null;
    Class[] setArgArray = new Class[] {boolean.class};
    Object[] getArgInvoke = null;
    try {
      Method mGetMethod = teleManager.getClass().getMethod("getDataEnabled", getArgArray);
      Method mSetMethod = teleManager.getClass().getMethod("setDataEnabled", setArgArray);
      boolean isOpen = (Boolean) mGetMethod.invoke(teleManager, getArgInvoke);
      if (isOpen) {
        mSetMethod.invoke(teleManager, false);
      } else {
        mSetMethod.invoke(teleManager, true);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public static void switchBle(){
    BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    // 若蓝牙没打开
    if(bluetoothAdapter.isEnabled()){
      bluetoothAdapter.disable();  //打开蓝牙，需要BLUETOOTH_ADMIN权限
    }else {
      bluetoothAdapter.enable();  //打开蓝牙，需要BLUETOOTH_ADMIN权限
    }
  }

  public static boolean isBleAvailable(){
    return BluetoothAdapter.getDefaultAdapter().isEnabled();
  }

}
