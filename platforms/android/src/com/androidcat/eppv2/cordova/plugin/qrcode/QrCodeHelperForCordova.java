package com.androidcat.eppv2.cordova.plugin.qrcode;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.util.Base64;

import com.androidcat.eppv2.cordova.plugin.TyPluginRequestCode;
import com.androidcat.eppv2.qrcode.CaptureActivity;
import com.google.zxing.core.QrUtil;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

import java.io.ByteArrayOutputStream;

/**
 * Created by androidcat on 2018/3/7.
 */

public class QrCodeHelperForCordova {
  private static final int JPEG = 0; // Take a picture of type JPEG
  private static final int PNG = 1;

  private static QrCodeHelperForCordova qrCodeHelper;
  private CallbackContext callbackContext;
  private CordovaPlugin plugin;

  private QrCodeHelperForCordova(){}
  private QrCodeHelperForCordova(CordovaPlugin plugin, CallbackContext callbackContext){
    this.plugin = plugin;
    this.callbackContext = callbackContext;
  }

  public static QrCodeHelperForCordova getQrCodeHelper(CordovaPlugin plugin, CallbackContext callbackContext){
    qrCodeHelper = new QrCodeHelperForCordova(plugin,callbackContext);
    return qrCodeHelper;
  }

  public static QrCodeHelperForCordova getQrCodeHelper(){
    return qrCodeHelper;
  }

  public void gotoQrCapture(){
    Intent intent = new Intent(plugin.cordova.getActivity(), CaptureActivity.class);
    plugin.cordova.startActivityForResult(plugin,intent, TyPluginRequestCode.REQUEST_QRCODE_SCAN);
  }

  public void onActivityResult(int requestCode, int resultCode, Intent intent){
    if (requestCode == TyPluginRequestCode.REQUEST_QRCODE_SCAN){
      if (resultCode == Activity.RESULT_OK){
        String result = intent.getExtras().getString("result");
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
      }else {
        callbackContext.error("用户取消扫描");
      }
    }
  }

  public static String generateBase64QrCode(String data) throws Exception{
    return processPicture(QrUtil.create2DCode(data),0);
  }

  /**
   * Compress bitmap using jpeg, convert to Base64 encoded string, and return to JavaScript.
   *
   * @param bitmap
   */
  public static String processPicture(Bitmap bitmap, int encodingType) throws Exception {
    ByteArrayOutputStream jpeg_data = new ByteArrayOutputStream();
    Bitmap.CompressFormat compressFormat = encodingType == JPEG ?
      Bitmap.CompressFormat.JPEG :
      Bitmap.CompressFormat.PNG;

    try {
      if (bitmap.compress(compressFormat, 100, jpeg_data)) {
        byte[] code = jpeg_data.toByteArray();
        byte[] output = Base64.encode(code, Base64.NO_WRAP);
        String js_out = new String(output);
        output = null;
        code = null;
        return js_out;
      }else {
        throw new Exception("转码失败");
      }
    } catch (Exception e) {
      throw e;
    }finally {
      jpeg_data = null;
    }
  }
}
