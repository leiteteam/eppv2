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
import java.io.IOException;

/**
 * Created by androidcat on 2018/3/7.
 */

public class QrCodeHelper {
  private static final int JPEG = 0; // Take a picture of type JPEG
  private static final int PNG = 1;

  private static QrCodeHelper qrCodeHelper;
  private CallbackContext callbackContext;
  private CordovaPlugin plugin;

  private QrCodeHelper(){}
  private QrCodeHelper(CordovaPlugin plugin,CallbackContext callbackContext){
    this.plugin = plugin;
    this.callbackContext = callbackContext;
  }

  public static QrCodeHelper getQrCodeHelper(CordovaPlugin plugin, CallbackContext callbackContext){
    qrCodeHelper = new QrCodeHelper(plugin,callbackContext);
    return qrCodeHelper;
  }

  public static QrCodeHelper getQrCodeHelper(){
    return qrCodeHelper;
  }

  public void gotoQrCapture(String title){
    Intent intent = new Intent(plugin.cordova.getActivity(), CaptureActivity.class);
    intent.putExtra("title_name", title );
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
    return processPicture(QrUtil.create2DCode(data),PNG);
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

  /**
   * bitmap转为base64
   * @param bitmap
   * @return
   */
  public static String bitmapToBase64(Bitmap bitmap) {

    String result = null;
    ByteArrayOutputStream baos = null;
    try {
      if (bitmap != null) {
        baos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);

        baos.flush();
        baos.close();

        byte[] bitmapBytes = baos.toByteArray();
        result = Base64.encodeToString(bitmapBytes, Base64.URL_SAFE);
      }
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      try {
        if (baos != null) {
          baos.flush();
          baos.close();
        }
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    return result;
  }
}
