package com.androidcat.eppv2.ui;

import android.app.Activity;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.TextView;
import android.widget.Toast;

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
import com.androidcat.utilities.LogUtil;
import com.androidcat.utilities.listener.OnSingleClickListener;
import com.androidcat.utilities.log.LogFileTool;
import com.androidcat.utilities.log.Logger;
import com.androidcat.utilities.qnyupload.http.ResponseInfo;
import com.androidcat.utilities.qnyupload.storage.UpCompletionHandler;
import com.flyco.animation.FlipEnter.FlipVerticalSwingEnter;
import com.flyco.dialog.listener.OnBtnClickL;
import com.flyco.dialog.widget.NormalDialog;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by androidcat on 2018/9/25.
 */

public class Crashctivity extends Activity{

  View rest;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    initUI(savedInstanceState);
  }

  private void initUI(@Nullable Bundle savedInstanceState) {
    requestWindowFeature(Window.FEATURE_NO_TITLE);// 不显示程序的标题栏
    setContentView(R.layout.activity_crash);
    rest = findViewById(R.id.rest);
    rest.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        finish();
        System.exit(0);
      }
    });
    showCrashDialog();
  }

  private void showCrashDialog() {
    String info = "哎呀，出错了！请点击确定帮助我改进吧！";
    final NormalDialog dialog = new NormalDialog(this);
    dialog.content(info)
      .contentTextColor(getResources().getColor(R.color.text_black))
      .title("")
      .btnText("确定") //
      .style(NormalDialog.STYLE_TWO)//
      .btnNum(1)
      .showAnim(new FlipVerticalSwingEnter())//
      .show();
    dialog.setOnBtnClickL(new OnBtnClickL() {
      @Override
      public void onBtnClick() {
        String userName = JepayDatabase.getInstance(Crashctivity.this).getCacheData("username");
        LogFileTool.getInstance().uploadLogAsync(userName,System.currentTimeMillis()/1000,upCompletionHandler);
        dialog.dismiss();
      }
    });
  }

  UpCompletionHandler upCompletionHandler = new UpCompletionHandler() {
    @Override
    public void complete(String key, ResponseInfo info, JSONObject response) {
      if (info.isOK()){
        // do nothing
        Toast.makeText(Crashctivity.this,"ok",Toast.LENGTH_SHORT).show();
      }else {
        Toast.makeText(Crashctivity.this,"err",Toast.LENGTH_SHORT).show();
      }
    }
  };

}
