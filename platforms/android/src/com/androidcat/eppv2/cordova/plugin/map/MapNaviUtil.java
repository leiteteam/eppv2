package com.androidcat.eppv2.cordova.plugin.map;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import com.amap.api.services.core.LatLonPoint;
import com.androidcat.utilities.Utils;


/**
 * Created by androidcat on 2018/5/31.
 */

public class MapNaviUtil {

  /**
   * 打开百度地图
   * @param slat 开始地点 维度
   * @param slon 开始地点 经度
   * @param sname 开始地点 名字
   * @param dlat 终点地点 维度
   * @param dlon 终点地点 经度
   * @param dname 终点名字
   * @param city 所在城市- 动态获取 （例如：北京市）
   * @author jack
   * created at 2017/8/2 15:01
   */
  public static void openBaiduMapNavi(Context context, String slat, String slon, String sname,
                                      String dlat, String dlon, String dname, String city) {
    try {
      String uri = getBaiduMapUri(String.valueOf(slat), String.valueOf(slon), sname,
        String.valueOf(dlat), String.valueOf(dlon), dname, city, "");
      Intent intent = Intent.parseUri(uri, 0);
      context.startActivity(intent); //启动调用
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public static String getBaiduMapUri(String originLat, String originLon, String originName, String desLat, String desLon, String destination, String region, String src){
    String uri = "intent://map/direction?origin=latlng:%1$s,%2$s|name:%3$s" +
      "&destination=latlng:%4$s,%5$s|name:%6$s&mode=driving&coord_type=gcj02&region=%7$s&src=%8$s#Intent;" +
      "scheme=bdapp;package=com.baidu.BaiduMap;end";
    return String.format(uri, originLat, originLon, originName, desLat, desLon, destination, region, src);
  }

  /**
   * 打开高德地图
   * @author jack
   * created at 2017/8/2 15:01
   */
  public static void openGaoDeMap(Context context, String slat, String slon, String sname, String dlat, String dlon, String dname) {
    try {
      // APP_NAME  自己应用的名字
      String uri = getGdMapUri(Utils.getAppName(context),
        slat,
        slon,
        sname,
        dlat,
        dlon,
        dname);
      Intent intent = new Intent(Intent.ACTION_VIEW);
      intent.setPackage("com.autonavi.minimap");
      intent.setData(Uri.parse(uri));
      context.startActivity(intent); //启动调用
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /**
   * 获取打开高德地图应用uri
   * style
   *导航方式(0 速度快; 1 费用少; 2 路程短; 3 不走高速；4 躲避拥堵；5
   *不走高速且避免收费；6 不走高速且躲避拥堵；
   *7 躲避收费和拥堵；8 不走高速躲避收费和拥堵)
   */
  public static String getGdMapUri(String appName, String slat, String slon, String sname, String dlat, String dlon, String dname){
    String newUri = "androidamap://navi?sourceApplication=%1$s&poiname=%2$s&lat=%3$s&lon=%4$s&dev=0&style=2";
    return String.format(newUri, appName, dname, dlat, dlon);
  }

  private final static double a = 6378245.0; // 长半轴
  private final static double pi = 3.14159265358979324; // π
  private final static double ee = 0.00669342162296594323; // e²
  // GCJ-02 to WGS-84
  public static LatLonPoint toGPSPoint(double latitude, double longitude) {
    LatLonPoint dev = calDev(latitude, longitude);
    double retLat = latitude - dev.getLatitude();
    double retLon = longitude - dev.getLongitude();
    for (int i = 0; i < 1; i++) {
      dev = calDev(retLat, retLon);
      retLat = latitude - dev.getLatitude();
      retLon = longitude - dev.getLongitude();
    }
    return new LatLonPoint(retLat, retLon);
  }

  // 计算偏差
  private static LatLonPoint calDev(double wgLat, double wgLon) {
    if (isOutOfChina(wgLat, wgLon)) {
      return new LatLonPoint(0, 0);
    }
    double dLat = calLat(wgLon - 105.0, wgLat - 35.0);
    double dLon = calLon(wgLon - 105.0, wgLat - 35.0);
    double radLat = wgLat / 180.0 * pi;
    double magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    double sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    return new LatLonPoint(dLat, dLon);
  }

  // 判断坐标是否在国外
  private static boolean isOutOfChina(double lat, double lon) {
    if (lon < 72.004 || lon > 137.8347)
      return true;
    if (lat < 0.8293 || lat > 55.8271)
      return true;
    return false;
  }

  // 计算纬度
  private static double calLat(double x, double y) {
    double resultLat = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
      + 0.2 * Math.sqrt(Math.abs(x));
    resultLat += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    resultLat += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    resultLat += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return resultLat;
  }

  // 计算经度
  private static double calLon(double x, double y) {
    double resultLon = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
      * Math.sqrt(Math.abs(x));
    resultLon += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    resultLon += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    resultLon += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0
      * pi)) * 2.0 / 3.0;
    return resultLon;
  }
}
