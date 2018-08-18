package com.androidcat.eppv2.persistence.bean;

import com.lidroid.xutils.db.annotation.Column;
import com.lidroid.xutils.db.annotation.Id;
import com.lidroid.xutils.db.annotation.NotNull;
import com.lidroid.xutils.db.annotation.Table;

/**
 * Created by androidcat on 2018/8/7.
 */

@Table(name = "Track")
public class Track {
  @Id
  @Column(column = "id")
  public long id;

  @Column(column = "userid")
  public String userid;

  @NotNull
  @Column(column = "taskid")
  public String taskid;

  @Column(column = "lat")
  public String lat;

  @Column(column = "lng")
  public String lng;

  @Column(column = "time")
  public long time;
}
