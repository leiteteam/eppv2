package com.androidcat.eppv2.ui;

import android.app.Activity;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.TextView;

import com.amap.api.maps.AMap;
import com.amap.api.maps.CameraUpdateFactory;
import com.amap.api.maps.MapView;
import com.amap.api.maps.model.BitmapDescriptorFactory;
import com.amap.api.maps.model.LatLng;
import com.amap.api.maps.model.LatLngBounds;
import com.amap.api.maps.model.MarkerOptions;
import com.amap.api.maps.model.PolylineOptions;
import com.androidcat.eppv2.R;
import com.androidcat.eppv2.bean.PathRecord;
import com.androidcat.eppv2.bean.TrackPoint;
import com.androidcat.eppv2.persistence.JepayDatabase;
import com.androidcat.eppv2.persistence.bean.Track;
import com.androidcat.utilities.listener.OnSingleClickListener;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by androidcat on 2018/9/25.
 */

public class TraceActivity extends Activity{

  private View back;
  private TextView title;
  private MapView mapView;

  private AMap mAMap;
  private List<PathRecord> records = new ArrayList<PathRecord>();
  private List<PolylineOptions> polylineOptionsList = new ArrayList<PolylineOptions>();

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    initUI(savedInstanceState);
    initMapData();
  }

  private void initUI(@Nullable Bundle savedInstanceState) {
    requestWindowFeature(Window.FEATURE_NO_TITLE);// 不显示程序的标题栏
    setContentView(R.layout.activity_trace);
    mapView = (MapView) findViewById(R.id.map);
    mapView.onCreate(savedInstanceState);// 此方法必须重写

    title = findViewById(R.id.app_title_text);
    back = findViewById(R.id.goBack);

    title.setText("轨迹详情");
    back.setOnClickListener(onSingleClickListener);
  }

  private OnSingleClickListener onSingleClickListener = new OnSingleClickListener() {
    @Override
    public void onSingleClick(View view) {
      if (view == back) {
        finish();
      }
    }
  };

  /**
   * 初始化
   */
  private void initMapData() {
    if (mAMap == null) {
      mAMap = mapView.getMap();
      setUpMap();
    }
  }

  /**
   * 设置一些amap的属性
   */
  private void setUpMap() {
    mAMap.getUiSettings().setMyLocationButtonEnabled(false);// 设置默认定位按钮是否显示
    String taskId = getIntent().getStringExtra("taskId");
    JepayDatabase database = JepayDatabase.getInstance(this);
    List<Track> recordList = database.getTrackList(taskId);
    if(recordList!=null){
      getTraceData(recordList);
      buildPolylineOptionsList();
      //地图轨迹
      mAMap.clear(true);
      drawLines();
      setupRecord();
    }
  }

  private void getTraceData(List<Track> list){
    PathRecord pathRecord = new PathRecord();
    if (list != null && list.size() > 0) {
      for (Track track : list) {
        TrackPoint point = new TrackPoint();
        point.latitude = track.lat;
        point.longitude = track.lng;
        pathRecord.addpoint(point);
      }

      TrackPoint startLoc = new TrackPoint();
      startLoc.longitude = list.get(0).lng;
      startLoc.latitude = list.get(0).lat;
      TrackPoint endLoc = new TrackPoint();
      endLoc.latitude = list.get(list.size() - 1).lat;
      endLoc.longitude = list.get(list.size() - 1).lng;
      pathRecord.setmStartPoint(startLoc);
      pathRecord.setmEndPoint(endLoc);
      records.add(pathRecord);
    }
  }

  /**
   * 轨迹数据初始化
   */
  private void setupRecord() {
    if (records != null && records.size() > 0) {
      PathRecord startRecord = records.get(0);
      PathRecord endRecord = records.get(records.size() - 1);
      TrackPoint startLoc = startRecord.getmStartPoint();
      TrackPoint endLoc = endRecord.getmEndPoint();
      if (startLoc == null || endLoc == null) {
        return;
      }
      LatLng startLatLng = new LatLng(Double.parseDouble(startLoc.latitude),
        Double.parseDouble(startLoc.longitude));
      LatLng endLatLng = new LatLng(Double.parseDouble(endLoc.latitude),
        Double.parseDouble(endLoc.longitude));
      mAMap.addMarker(new MarkerOptions().position(
        startLatLng).icon(
        BitmapDescriptorFactory.fromResource(R.mipmap.trace_start)));
      mAMap.addMarker(new MarkerOptions().position(
        endLatLng).icon(
        BitmapDescriptorFactory.fromResource(R.mipmap.trace_end)));
      mAMap.moveCamera(CameraUpdateFactory.newLatLngBounds(getBounds(), 50));
    } else {
      Log.i("MY", "mRecord == null");
    }

  }

  //画运动时的路径图
  private void drawLines() {
    if (polylineOptionsList.size() > 0) {
      for (PolylineOptions options : polylineOptionsList) {
        if (options.getPoints().size() > 0) {
          mAMap.addPolyline(options);
        }
      }
    }
  }

  private void buildPolylineOptionsList() {
    for (PathRecord pathRecord : records) {
      PolylineOptions polylineOptions = new PolylineOptions();
      polylineOptions.width(15f);
      polylineOptions.useGradient(true);
      polylineOptions.colorValues(pathRecord.getColorValues());
      for (TrackPoint point : pathRecord.getmPathLinePoints()) {
        LatLng loc = new LatLng(Double.parseDouble(point.latitude),
          Double.parseDouble(point.longitude));
        polylineOptions.add(loc);

      }
      polylineOptionsList.add(polylineOptions);
    }
  }

  //获取路径的边界
  private LatLngBounds getBounds() {
    LatLngBounds.Builder b = LatLngBounds.builder();
    if (records == null) {
      return b.build();
    }
    //遍历所有路径段，每个路径段进行逐个点的囊括计算边界
    for (PathRecord record : records) {
      for (TrackPoint point : record.getmPathLinePoints()) {
        b.include(new LatLng(Double.parseDouble(point.latitude), Double.parseDouble(point.longitude)));
      }
    }
    return b.build();
  }
}
