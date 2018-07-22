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

@Table(name = "KeyValueCache")
public class KeyValue implements Parcelable{

    @Column(column = "time")
    public long time;

    @Id
    @Column(column = "key")
    @NotNull
    public String key;

    @Column(column = "value")
    public String value;

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeLong(this.time);
        dest.writeString(this.key);
        dest.writeString(this.value);
    }

    public KeyValue() {
    }

    protected KeyValue(Parcel in) {
        this.time = in.readLong();
        this.key = in.readString();
        this.value = in.readString();
    }

    public static final Creator<KeyValue> CREATOR = new Creator<KeyValue>() {
        @Override
        public KeyValue createFromParcel(Parcel source) {
            return new KeyValue(source);
        }

        @Override
        public KeyValue[] newArray(int size) {
            return new KeyValue[size];
        }
    };
}
