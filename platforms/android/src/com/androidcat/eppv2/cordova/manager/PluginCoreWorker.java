package com.androidcat.eppv2.cordova.manager;

import com.androidcat.eppv2.cordova.plugin.print.DzPrinterHelper;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;

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
}
