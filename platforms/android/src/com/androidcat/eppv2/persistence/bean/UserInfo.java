package com.androidcat.eppv2.persistence.bean;

import com.lidroid.xutils.db.annotation.Column;
import com.lidroid.xutils.db.annotation.Id;
import com.lidroid.xutils.db.annotation.NotNull;
import com.lidroid.xutils.db.annotation.Table;

/**
 * Created by androidcat on 2018/8/1.
 */

@Table(name = "UserInfo")
public class UserInfo {

  public UserInfo(){}

  @Id
  @NotNull
  @Column(column = "username")
  public String username;

  @Column(column = "userid")
  public String userid;

  @Column(column = "password")
  public String password;

  @Column(column = "token")
  public String token;

  @Column(column = "appType")
  public String appType;
}
