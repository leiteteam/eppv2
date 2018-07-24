package com.androidcat.eppv2.cordova.manager;

import com.androidcat.eppv2.cordova.plugin.print.DzPrinterHelper;
import com.androidcat.eppv2.cordova.plugin.qrcode.QrCodeHelper;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONObject;

/**
 * Created by androidcat on 2018/7/22.
 */

public class PluginCoreWorker {

  public static void print(final String message, final CallbackContext callbackContext){
    DzPrinterHelper printerHelper = new DzPrinterHelper();
    if (printerHelper.isPrinterConnected()){
      if (printerHelper.print2dBarcode(message,printerHelper.getPrintParam(1,0))){
        callbackContext.success("打印成功");
      }else {
        callbackContext.error("打印失败，请确保打印设备连接无误后再试");
      }
    }else {
      callbackContext.error("打印机尚未连接，请确保打印设备连接正常后再试");
    }
  }

  public static void init(final CordovaPlugin plugin, final CallbackContext callbackContext){
    DzPrinterHelper printerHelper = new DzPrinterHelper();
    printerHelper.init(plugin.cordova.getActivity(),callbackContext);
  }

  public static void openOfflineMap(final CordovaPlugin plugin, final CallbackContext callbackContext){

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
}
