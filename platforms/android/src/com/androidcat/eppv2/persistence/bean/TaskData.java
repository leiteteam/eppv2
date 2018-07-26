package com.androidcat.eppv2.persistence.bean;

import android.os.Parcel;
import android.os.Parcelable;

import com.lidroid.xutils.db.annotation.Column;
import com.lidroid.xutils.db.annotation.Id;
import com.lidroid.xutils.db.annotation.NotNull;
import com.lidroid.xutils.db.annotation.Table;

/**
 * Created by androidcat on 2017/11/21.
 */

@Table(name = "TaskData")
public class TaskData implements Parcelable {

  @Id
  @NotNull
  @Column(column = "taskid")
  public String taskid;

  @Column(column = "userid")
  public String userid;

  @Column(column = "taskData")
  public String taskData;

  //0:待采样;1:已采样未上传，可修改
  @Column(column = "state")
  public int state;


  protected TaskData(Parcel in) {
    taskid = in.readString();
    userid = in.readString();
    taskData = in.readString();
    state = in.readInt();
  }

  public static final Creator<TaskData> CREATOR = new Creator<TaskData>() {
    @Override
    public TaskData createFromParcel(Parcel in) {
      return new TaskData(in);
    }

    @Override
    public TaskData[] newArray(int size) {
      return new TaskData[size];
    }
  };

  @Override
  public int describeContents() {
    return 0;
  }

  @Override
  public void writeToParcel(Parcel dest, int flags) {
    dest.writeString(taskid);
    dest.writeString(userid);
    dest.writeString(taskData);
    dest.writeInt(state);
  }
}
