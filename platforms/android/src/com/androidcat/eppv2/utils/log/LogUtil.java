package com.androidcat.eppv2.utils.log;

import android.text.TextUtils;

import com.androidcat.eppv2.application.AppConfig;


/**
 * @ClassName LogUtil
 * @Description 打印log处理工具类
 * @date 2014-9-15
 */
public final class LogUtil {

	private static final String TAG = "LogUtil:";

	private static final String BOUNDRY = "----";

	private LogUtil() {

	}

	public static void d(String msg) {
		if (AppConfig.loggable) {
			if (TextUtils.isEmpty(msg)){
				android.util.Log.d(TAG, BOUNDRY + "msg is null" + BOUNDRY);
			} else {
				android.util.Log.d(TAG, BOUNDRY + msg + BOUNDRY);
			}
		}
	}

	public static void e(String msg) {
		if (AppConfig.loggable) {
			if (TextUtils.isEmpty(msg)){
				android.util.Log.e(TAG, BOUNDRY + "msg is null" + BOUNDRY);
			} else {
				android.util.Log.e(TAG, BOUNDRY + msg + BOUNDRY);
			}
		}
	}

	public static void d(String msg, String msgb) {
		if (AppConfig.loggable) {
			if (TextUtils.isEmpty(msgb)){
				android.util.Log.d(TAG, BOUNDRY + "msg is null" + BOUNDRY);
			} else {
				android.util.Log.d(TAG, BOUNDRY + msg + ":" + msgb + BOUNDRY);
			}
		}
	}

	public static void e(String msg, String msgb) {
		if (AppConfig.loggable) {
			if (TextUtils.isEmpty(msgb)){
				android.util.Log.e(TAG, BOUNDRY + "msg is null" + BOUNDRY);
			} else {
				android.util.Log.e(TAG, BOUNDRY + msg + ":" + msgb + BOUNDRY);
			}
		}
	}

	public static void i(String msg, String msgb) {
		if (AppConfig.loggable) {
			if (TextUtils.isEmpty(msgb)){
				android.util.Log.i(TAG, BOUNDRY + "msg is null" + BOUNDRY);
			} else {
				android.util.Log.i(TAG, BOUNDRY + msg + ":" + msgb + BOUNDRY);
			}
		}
	}

	public static void w(String msg, String msgb) {
		if (AppConfig.loggable) {
			if (TextUtils.isEmpty(msgb)){
				android.util.Log.w(TAG, BOUNDRY + "msg is null" + BOUNDRY);
			} else {
				android.util.Log.w(TAG, BOUNDRY + msg + ":" + msgb + BOUNDRY);
			}
		}
	}

	public static void e(String tag2, String src, Exception e) {
		if (AppConfig.loggable) {
			if (TextUtils.isEmpty(src)){
				android.util.Log.e(TAG, BOUNDRY + "msg is null" + BOUNDRY);
			} else {
				android.util.Log.e(TAG, BOUNDRY + tag2 + ":" + src+"\n"+e.toString() + BOUNDRY);
			}
		}
	}

}
