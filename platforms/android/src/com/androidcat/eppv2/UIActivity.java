package com.androidcat.eppv2;

import android.os.Bundle;
import android.widget.LinearLayout;

import org.apache.cordova.CordovaActivity;

/**
 * Created by androidcat on 2018/7/2.
 */

public class UIActivity extends CordovaActivity {

  private LinearLayout rootView;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    super.init();
    // enable Cordova apps to be started in the background
    Bundle extras = getIntent().getExtras();
    if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
      moveTaskToBack(true);
    }
    loadUrl(launchUrl);

    initUI();
  }

  private void initUI(){
    setContentView(R.layout.ui_activity);
    rootView = findViewById(R.id.root);
    //add web view here
    rootView.addView(appView.getView());
  }
}
