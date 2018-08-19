package com.androidcat.eppv2.ui;

import android.app.Activity;
import android.graphics.Color;
import android.location.Location;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.TextView;

import com.amap.api.maps.AMap;
import com.amap.api.maps.AMapOptions;
import com.amap.api.maps.AMapUtils;
import com.amap.api.maps.MapView;
import com.amap.api.maps.model.BitmapDescriptorFactory;
import com.amap.api.maps.model.LatLng;
import com.amap.api.maps.model.Marker;
import com.amap.api.maps.model.MarkerOptions;
import com.amap.api.maps.model.MyLocationStyle;
import com.amap.api.maps.model.Polyline;
import com.amap.api.maps.model.PolylineOptions;
import com.androidcat.eppv2.R;
import com.androidcat.utilities.listener.OnSingleClickListener;

import org.json.JSONException;
import org.json.JSONObject;

public class FindOnMapActivity extends Activity implements AMap.OnMyLocationChangeListener{
    private AMap aMap;
    private MapView mapView;
    private View exit;
    private View back;
    private TextView title;
    private TextView disTv;

    private LatLng latlngTar = new LatLng(0, 0);
    private Marker makerTar;

    private MyLocationStyle myLocationStyle;
    private Polyline polyline;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initUI(savedInstanceState);
        initMap();
        initData();
    }

    /**
     * 方法必须重写
     */
    @Override
    protected void onResume() {
        super.onResume();
        mapView.onResume();
    }

    /**
     * 方法必须重写
     */
    @Override
    protected void onPause() {
        super.onPause();
        mapView.onPause();
    }

    /**
     * 方法必须重写
     */
    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        mapView.onSaveInstanceState(outState);
    }

    /**
     * 方法必须重写
     */
    @Override
    protected void onDestroy() {
        super.onDestroy();
        mapView.onDestroy();
    }

    private void initUI(@Nullable Bundle savedInstanceState){
        requestWindowFeature(Window.FEATURE_NO_TITLE);// 不显示程序的标题栏
        setContentView(R.layout.activity_findonmap);
        mapView = (MapView) findViewById(R.id.map);
        mapView.onCreate(savedInstanceState);// 此方法必须重写

        title = findViewById(R.id.app_title_text);
        disTv = findViewById(R.id.disTv);
        back = findViewById(R.id.goBack);
        exit = findViewById(R.id.back);

        title.setText("地图找点");
        back.setOnClickListener(onSingleClickListener);
        exit.setOnClickListener(onSingleClickListener);
    }

    private OnSingleClickListener onSingleClickListener = new OnSingleClickListener() {
        @Override
        public void onSingleClick(View view) {
            if (view == back || view == exit){
                finish();
            }
        }
    };

    /**
     * 初始化
     */
    private void initMap() {
        if (aMap == null) {
            aMap = mapView.getMap();
            setUpMap();
        }
        //设置SDK 自带定位消息监听
        aMap.setOnMyLocationChangeListener(this);
    }

    private void initData(){
        disTv.setText("正在定位...");
        String loc = getIntent().getStringExtra("target");
        try {
            JSONObject jsonObject = new JSONObject(loc);
            double lat = jsonObject.optDouble("lat");
            double lng = jsonObject.optDouble("lng");
            this.latlngTar = new LatLng(lat,lng);
        } catch (JSONException e) {
            e.printStackTrace();
            disTv.setText("传入的目标位置有误，无法寻点");
        }
    }

    /**
     * 设置一些amap的属性
     */
    private void setUpMap() {
        // 如果要设置定位的默认状态，可以在此处进行设置
        myLocationStyle = new MyLocationStyle();
        myLocationStyle.myLocationType(MyLocationStyle.LOCATION_TYPE_LOCATION_ROTATE);
        myLocationStyle.interval(30000);
        aMap.setMyLocationStyle(myLocationStyle);
        aMap.getUiSettings().setMyLocationButtonEnabled(true);// 设置默认定位按钮是否显示
        aMap.getUiSettings().setCompassEnabled(true);
        aMap.getUiSettings().setScaleControlsEnabled(true);
        aMap.getUiSettings().setZoomPosition(AMapOptions.ZOOM_POSITION_RIGHT_CENTER);
        aMap.setMyLocationEnabled(true);// 设置为true表示显示定位层并可触发定位，false表示隐藏定位层并不可触发定位，默认是false
    }

    @Override
    public void onMyLocationChange(Location location) {
        // 定位回调监听
        if(location != null) {
            Log.e("amap", "onMyLocationChange 定位成功， lat: " + location.getLatitude() + " lon: " + location.getLongitude());
            LatLng src = new LatLng(location.getLatitude(),location.getLongitude());
            drawLine(src,latlngTar);
        } else {
            Log.e("amap", "定位失败");
        }
    }

    private void drawLine(LatLng src,LatLng dst){
        if (this.polyline != null){
            this.polyline.remove();
        }
        if (this.makerTar != null){
            this.makerTar.remove();
        }
        this.makerTar = aMap.addMarker(new MarkerOptions()
                .position(dst)
                .icon(BitmapDescriptorFactory.fromResource(R.mipmap.amap_end)));
        //设置虚线
        this.polyline = aMap.addPolyline(new PolylineOptions().add(src,dst).setDottedLine(true).color(Color.GREEN));

        //显示距离
        int distance = (int) AMapUtils.calculateLineDistance(src, dst);
        this.disTv.setText(com.androidcat.eppv2.utils.AMapUtil.getFriendlyLength(distance));
    }
}
