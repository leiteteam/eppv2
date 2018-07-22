package com.androidcat.eppv2.ui;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.view.Window;
import android.view.inputmethod.InputMethodManager;
import android.widget.Toast;

import com.androidcat.eppv2.utils.ResourceUtil;
import com.androidcat.eppv2.utils.log.LogUtil;

import org.json.JSONObject;

import java.lang.ref.WeakReference;

/**
 * @ClassName BaseActivity
 * @Description 基类
 * @author xuxiang
 * @date 2014-09-16
 */
public class BaseActivity extends Activity {
	/**
	 * DEFAULT LOGIN TIMEOUT MESSAGE
	 */
	protected static final int MESSAGE_LOGIN_TIMEOUT = 1313;
	/**
	 * DEFAULT LOADING MESSAGE
	 */
	private static final String MESSAGE_PROCESSING = "正在加载，请稍候...";

	/**
	 * the ProgressDialog object
	 */
	private ProgressDialog mProgressDialog = null;

	/**
	 *
	 */
	protected BaseActivity mInstance = null;

	/**
	 *
	 */
	protected Context mContext = null;

	public static boolean needOpenTimmer = true;

	public static boolean isChoosetPicType  = false;
	protected ActivityHandler baseHandler = new ActivityHandler(this);

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
    requestWindowFeature(Window.FEATURE_NO_TITLE);
		LogUtil.d("onCreate in BaseActivity");
		init();
	}

	private void init(){
		if (mInstance == null){
			mInstance = this;
		}
		if (mContext == null){
//			mContext = getApplicationContext();
		    /*  修改原因：因为dialog必须要依附在Activity才能存活。*/
			mContext = this;
		}
//		registReceiver();
	}

	@Override
	protected void onSaveInstanceState(Bundle outState) {
		super.onSaveInstanceState(outState);
	}

	public void showToast(final String text) {
		runOnUiThread(new Runnable() {
			@Override
			public void run() {
				if (TextUtils.isEmpty(text)){
					Toast.makeText(BaseActivity.this, "未知错误", Toast.LENGTH_SHORT).show();
				} else {
					Toast.makeText(BaseActivity.this, text, Toast.LENGTH_SHORT).show();
				}
			}
		});
	}

	public void showLongToast(final String text) {
		runOnUiThread(new Runnable() {
			@Override
			public void run() {
				if (TextUtils.isEmpty(text)){
					Toast.makeText(BaseActivity.this, "未知错误", Toast.LENGTH_LONG).show();
				} else {
					Toast.makeText(BaseActivity.this, text, Toast.LENGTH_LONG).show();
				}
			}
		});
	}

	public void showToastById(final String stringRes) {
		runOnUiThread(new Runnable() {
			@Override
			public void run() {
				Toast.makeText(BaseActivity.this, ResourceUtil.getStringById(BaseActivity.this, stringRes), Toast.LENGTH_SHORT).show();
			}
		});
	}

	public void showDialog() {
		showDialog(MESSAGE_PROCESSING);
	}

	public void showDialog(Boolean isCancele) {
		showDialog(MESSAGE_PROCESSING, isCancele);
	}

	public void showDialog(final String message) {
		if (isFinishing()) {
			return;
		}
		if (mProgressDialog == null) {
			mProgressDialog = ProgressDialog.show(this, "", message);
			mProgressDialog.setCancelable(false);
			mProgressDialog.setCanceledOnTouchOutside(false);
		} else {
			runOnUiThread(new Runnable() {

				@Override
				public void run() {
					mProgressDialog.setMessage(message);
					mProgressDialog.show();
				}
			});
		}
	}

	public void showDialog(final String message, Boolean isCancele) {
		if (isFinishing()) {
			return;
		}
		if (mProgressDialog == null) {
			mProgressDialog = ProgressDialog.show(this, "", message);
			mProgressDialog.setCancelable(isCancele);
			mProgressDialog.setCanceledOnTouchOutside(false);
		} else {
			mProgressDialog.setCancelable(isCancele);
			mProgressDialog.setMessage(message);
			runOnUiThread(new Runnable() {

				@Override
				public void run() {
					mProgressDialog.setMessage(message);
					mProgressDialog.show();
				}
			});
		}
	}

	public boolean isDialogShowing() {
		return (mProgressDialog != null && mProgressDialog.isShowing());
	}

	public void dismissDialog() {
		try {
			if (isFinishing()) {
				return;
			}
			if (mProgressDialog != null && mProgressDialog.isShowing()) {
				mProgressDialog.dismiss();
			}
		} catch (Exception e){
			e.printStackTrace();
		}
	}

	public Context getContext(){
		return getApplicationContext();
	}

	@Override
	protected void onResume() {
		super.onResume();
	}

	@Override
	protected void onStop() {
		super.onStop();
		LogUtil.e("onStop()");
	}

	@Override
	protected void onDestroy() {
//		unregisterReceiver(mScreenReceiver);
		super.onDestroy();
	}

	public static class ActivityHandler extends Handler {
		private final WeakReference<BaseActivity> mInstance;

		public ActivityHandler(BaseActivity instance) {
			mInstance = new WeakReference<BaseActivity>(instance);
		}

		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			BaseActivity activity = mInstance.get();
			if (null == activity) {
				return;
			}
			activity.handleEventMsg(msg);
		}
	}

	protected void handleEventMsg(Message msg) {
		switch (msg.what) {
			case MESSAGE_LOGIN_TIMEOUT:
				showToast("登录会话已超时，请重新登录!");
				dismissDialog();
				//gotoLogin();
				break;
		}
		childHandleEventMsg(msg);
	}


	protected void childHandleEventMsg(Message msg) {
		//do nothing ...
		//only for when child need to handle those messages processed by super class
	}

	//1:biz ok;
	//0:biz err;
	//-1:login timeout ;
	protected int checkIfBizErr(JSONObject jsonObject){
		if (jsonObject == null){
			return 0;
		}
		String returnCode = jsonObject.optString("ACTION_RETURN_CODE");
		if ("000000".equals(returnCode)){
			return 1;
		}else {
			if("444444".equals(returnCode)){
				return -1;
			}else {
				return 0;
			}
		}
	}

	protected void hideKeyboard(){
		InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
		imm.toggleSoftInput(0, InputMethodManager.HIDE_NOT_ALWAYS);
	}
}
