package com.androidcat.eppv2.bean;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Project: eppv2
 * Author: androidcat
 * Email:androidcat@126.com
 * Created at: 2018-9-22 19:09:37
 * add function description here...
 */
public class TrackPoint implements Parcelable {

  public static final Creator<TrackPoint> CREATOR = new Creator<TrackPoint>() {
    @Override
    public TrackPoint createFromParcel(Parcel source) {
      return new TrackPoint(source);
    }

    @Override
    public TrackPoint[] newArray(int size) {
      return new TrackPoint[size];
    }
  };
  public String latitude;
  public String longitude;
  public String altitude;
  public String speed;

  public TrackPoint(String lat, String lng, String alt, String speed) {
    this.latitude = lat;
    this.longitude = lng;
    this.altitude = alt;
    this.speed = speed;
  }

  public TrackPoint() {
  }

  protected TrackPoint(Parcel in) {
    this.latitude = in.readString();
    this.longitude = in.readString();
    this.altitude = in.readString();
    this.speed = in.readString();
  }

  public String getLatitude() {
    return latitude;
  }

  public String getLongitude() {
    return longitude;
  }

  public String getAltitude() {
    return altitude;
  }

  public String getSpeed() {
    return speed;
  }

  @Override
  public int describeContents() {
    return 0;
  }

  @Override
  public void writeToParcel(Parcel dest, int flags) {
    dest.writeString(this.latitude);
    dest.writeString(this.longitude);
    dest.writeString(this.altitude);
    dest.writeString(this.speed);
  }
}
