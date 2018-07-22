package com.androidcat.eppv2.utils;

import android.util.Log;

import com.androidcat.eppv2.utils.log.LogUtil;

/**
 * Created by androidcat on 2017/12/11.
 */

public class JepayUtil {

  //请求加密方法
  public static String encodeRequest(String actionInfo){
    try{
      String key = "77c3052b141a481dd2f377c51571812c";
      long now = System.currentTimeMillis();
      //1.生成随机数
      //String random = "E2B99E716973462EF3462107BD4AED13";
      String random =  DesTools.generalStringToAscii(8)+DesTools.generalStringToAscii(8);
      LogUtil.e("encypt","random:"+random);
      //2.生成过程密钥
      String processKey = DesTools.desecb(key,random,0);
      LogUtil.e("processKey","processKey:"+processKey);
      //3. 将actionInfo转换16进制后，补80
      actionInfo = DesTools.padding80(DesTools.bytesToHexString(actionInfo.getBytes("UTF-8")));
      LogUtil.e("actionInfo","actionInfo padding80:"+actionInfo);
      //4. 将字符串编码成16进制数字,适用于所有字符（包括中文）
      actionInfo = DesTools.encodeHexString(actionInfo);
      LogUtil.e("actionInfo","actionInfo encodeHexString:"+actionInfo);
      // 加密
      actionInfo = DesTools.desecb(processKey, actionInfo,0);
      // 最终生成密文
      String end = random + actionInfo;

      LogUtil.e("encypt","encypt data:"+end);
      LogUtil.e("encypt","costs:"+(System.currentTimeMillis()-now));
      return end;
    }catch (Exception e){
      LogUtil.e("encode request failed");
      return "encode request failed";
    }
  }

  public static String decodeResponse(String data){
    try{
      String key = "77c3052b141a481dd2f377c51571812c";
      long now = System.currentTimeMillis();
      // 获取随机数
      String randData = data.substring(0, 32);
      Log.e("randData","randData:"+randData);
      // 获取应用密文
      String singData = data.substring(32, data.length());
      Log.e("singData","singData:"+singData);
      // 获取过程密钥
      String processKey = DesTools.desecb(key, randData,0);
      Log.e("processKey","processKey:"+processKey);
      // 解密singData
      String actionInfoString = DesTools.desecb(processKey, singData,1);
      Log.e("actionInfoString","actionInfoString:"+actionInfoString);
      // 将16进制数字解码成字符串,适用于所有字符（包括中文）
      actionInfoString = DesTools.hexStringToString(actionInfoString);
      // 最后一个'80'出现的位置
      int num = actionInfoString.lastIndexOf("80");
      // 截取actionInfoString
      if (num != -1) {
        actionInfoString = actionInfoString.substring(0, num);
      }
      // actionInfoString转换为字符串
      actionInfoString = new String(DesTools.hexToBytes(actionInfoString), "UTF-8");

      Log.e("decypt","decode data:"+actionInfoString);
      Log.e("decypt"," costs:"+(System.currentTimeMillis()-now));
      return actionInfoString;
    }catch (Exception e){
      LogUtil.e("decode request failed");
      return "decode request failed";
    }
  }
}
