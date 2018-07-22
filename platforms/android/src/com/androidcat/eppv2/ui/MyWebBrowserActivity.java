package com.androidcat.eppv2.ui;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

import com.androidcat.eppv2.R;
import com.androidcat.eppv2.utils.Utils;
import com.androidcat.eppv2.view.ProgressWebView;


public class MyWebBrowserActivity extends BaseActivity {
  private static String TAG = "MyWebBrowserActivity";
  private TextView navigation_tv;
  private View leafTitleTv;
  private View titleView;
  private ProgressWebView webview;
  private String title = "";
  private String url = "";
  private String isShowTitle = "";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    initLayout();

    if (getIntent().getExtras() != null) {
      title = getIntent().getExtras().getString("title");
      url = getIntent().getExtras().getString("url");
      isShowTitle = getIntent().getExtras().getString("isShowTitle");
      if (!Utils.isNull(isShowTitle)) {
        titleView.setVisibility(View.GONE);
      }
      if (!Utils.isNull(title)) {
        navigation_tv.setText(title);
      }
      webview.loadUrl(url);
    }
    leafTitleTv.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        finish();
      }
    });
    setupWebView();
  }

  private void initLayout() {
    setContentView(R.layout.activity_webview);

    titleView = findViewById(R.id.fullscreen_custom_content);
    navigation_tv = findViewById(R.id.tv_title);
    leafTitleTv = findViewById(R.id.back);
    webview = findViewById(R.id.webView);
  }

  private void setupWebView() {
    // 是否支持脚本
    webview.getSettings().setJavaScriptEnabled(true);
    //支持缩放
    webview.getSettings().setSupportZoom(true);
    //自动适应屏幕
    webview.getSettings().setLoadWithOverviewMode(true);
    webview.getSettings().setUseWideViewPort(true);

    webview.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
    webview.getSettings().setDomStorageEnabled(true);
    String appCachePath = getApplicationContext().getCacheDir().getAbsolutePath();
    webview.getSettings().setAppCachePath(appCachePath);
    webview.getSettings().setAllowFileAccess(true);
    webview.getSettings().setAppCacheEnabled(true);
    webview.setWebViewClient(new WebViewClient() {
      @Override
      public boolean shouldOverrideUrlLoading(WebView view, String url) {
        if (url.startsWith("tel:")) {
          Intent intent = new Intent(Intent.ACTION_VIEW,
            Uri.parse(url));
          startActivity(intent);
        } else if (url.startsWith("http:") || url.startsWith("https:")) {
          webview.loadUrl(url);
        }
        return true;
      }

      @Override
      public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
      }
    });
    webview.setSelfWebChromeClient();
  }

  @Override
  protected void onPause() {
    super.onPause();
  }

  @Override
  protected void onResume() {
    super.onResume();
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if ((keyCode == KeyEvent.KEYCODE_BACK) && webview.canGoBack()) {
      webview.goBack();
      return true;
    }
    return super.onKeyDown(keyCode, event);
  }

  public final class Contact {
    //JavaScript调用此方法拨打电话
    @JavascriptInterface
    public void call(String id) {
      if (id != null && id.equals("exit")) {
        finish();
      }
    }

  }

}
