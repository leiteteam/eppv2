package com.androidcat.eppv2.bean;

import android.os.Parcel;
import android.os.Parcelable;

import java.util.ArrayList;
import java.util.List;

/**
 * 用于记录一条轨迹，包括起点、终点、轨迹中间点、距离、耗时、平均速度、时间
 *
 * @author ligen
 */
public class PathRecord implements Parcelable {
    public static final Creator<PathRecord> CREATOR = new Creator<PathRecord>() {
        @Override
        public PathRecord createFromParcel(Parcel source) {
            return new PathRecord(source);
        }

        @Override
        public PathRecord[] newArray(int size) {
            return new PathRecord[size];
        }
    };
    private TrackPoint mStartPoint;
    private TrackPoint mEndPoint;
    private float minSpeed;
    private float maxSpeed;
    private float averageSpeed;
    private float mDistance;
    private long mDuration;
    private long mStartTime;
    private int mId = 0;
    private ArrayList<TrackPoint> mPathLinePoints = new ArrayList<TrackPoint>();
    private List<Integer> colorValues = new ArrayList<Integer>();

    public PathRecord() {

    }

    protected PathRecord(Parcel in) {
        this.mStartPoint = in.readParcelable(TrackPoint.class.getClassLoader());
        this.mEndPoint = in.readParcelable(TrackPoint.class.getClassLoader());
        this.minSpeed = in.readFloat();
        this.maxSpeed = in.readFloat();
        this.averageSpeed = in.readFloat();
        this.mDistance = in.readFloat();
        this.mDuration = in.readLong();
        this.mStartTime = in.readLong();
        this.mId = in.readInt();
        this.mPathLinePoints = in.createTypedArrayList(TrackPoint.CREATOR);
        this.colorValues = new ArrayList<Integer>();
        in.readList(this.colorValues, Integer.class.getClassLoader());
    }

    public int getId() {
        return mId;
    }

    public void setId(int id) {
        this.mId = id;
    }

    public float getAverageSpeed() {
        return averageSpeed;
    }

    public void setAverageSpeed(float averageSpeed) {
        this.averageSpeed = averageSpeed;
    }

    public List<Integer> getColorValues() {
        return colorValues;
    }

    public void setColorValues(List<Integer> colorValues) {
        this.colorValues = colorValues;
    }

    public TrackPoint getmStartPoint() {
        return mStartPoint;
    }

    public void setmStartPoint(TrackPoint mStartPoint) {
        this.mStartPoint = mStartPoint;
    }

    public TrackPoint getmEndPoint() {
        return mEndPoint;
    }

    public void setmEndPoint(TrackPoint mEndPoint) {
        this.mEndPoint = mEndPoint;
    }

    public ArrayList<TrackPoint> getmPathLinePoints() {
        return mPathLinePoints;
    }

    public void setmPathLinePoints(ArrayList<TrackPoint> mPathLinePoints) {
        this.mPathLinePoints = mPathLinePoints;
    }

    public float getMaxSpeed() {
        return maxSpeed;
    }

    public void setMaxSpeed(float maxSpeed) {
        this.maxSpeed = maxSpeed;
    }

    public float getMinSpeed() {
        return minSpeed;
    }

    public void setMinSpeed(float minSpeed) {
        this.minSpeed = minSpeed;
    }

    public float getmDistance() {
        return mDistance;
    }

    public void setmDistance(float mDistance) {
        this.mDistance = mDistance;
    }

    public long getmDuration() {
        return mDuration;
    }

    public void setmDuration(long mDuration) {
        this.mDuration = mDuration;
    }

    public long getmStartTime() {
        return mStartTime;
    }

    public void setmStartTime(long mStartTime) {
        this.mStartTime = mStartTime;
    }

    public void addpoint(TrackPoint point) {
        mPathLinePoints.add(point);
    }

    public void addColor(int color) {
        colorValues.add(color);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeParcelable(this.mStartPoint, flags);
        dest.writeParcelable(this.mEndPoint, flags);
        dest.writeFloat(this.minSpeed);
        dest.writeFloat(this.maxSpeed);
        dest.writeFloat(this.averageSpeed);
        dest.writeFloat(this.mDistance);
        dest.writeLong(this.mDuration);
        dest.writeLong(this.mStartTime);
        dest.writeInt(this.mId);
        dest.writeTypedList(mPathLinePoints);
        dest.writeList(this.colorValues);
    }
}
