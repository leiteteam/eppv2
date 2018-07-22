package com.androidcat.eppv2.bean;


/**
 * Created by Administrator on 2015-12-16.
 */
public class VersionUpdateResponse {
  public String versionCode;
  public String versionName;
  public String versionLog;
  public String versionPath;
  public String isForce;
  public int type;//0:原生更新；1：资源包更新

}
