package com.androidcat.eppv2.cordova.plugin.map;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;

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
}
