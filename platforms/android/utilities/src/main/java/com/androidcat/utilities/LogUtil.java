package com.androidcat.utilities;

import android.util.Log;


/**
 * ***********************************************************
 * 功能：日志打印的工具类，GLOBAL为true表示全局开启日志打印，false表示全局关闭日志打印<br>
 *     每个级别的日志由该级别的控制变量控制开关
 * 作者：薛龙<br>
 * 时间：2016-1-16<br>
 * ***********************************************************
 */

public final class LogUtil {

    private static final String TAG = "epp_v2_";

    private static final boolean GLOBAL = true;
    private static final boolean DEBUG = true;
    private static final boolean INFO = true;
    private static final boolean VERBOSE = true;
    private static final boolean ERROR = true;
    private static final boolean WARN = true;

    public static void e(String tag, String msg) {
        if (GLOBAL) {
            if (ERROR) {
                Log.e(TAG+tag,msg);
            }
        }
    }

    public static void e(String tag, String msg, Exception e) {
        if (!GLOBAL) {
            return;
        }
        if (ERROR) {
          Log.e(tag,e.getMessage());
        }
    }

    public static void v(String tag, String msg) {
        if (!GLOBAL) {
            return;
        }
        if (VERBOSE) {
          Log.v(TAG+tag,msg);
        }
    }

    public static void i(String tag, String msg) {
        if (!GLOBAL) {
            return;
        }
        if (INFO) {
          Log.i(TAG+tag,msg);
        }
    }

    public static void d(String tag, String msg) {
        if (!GLOBAL) {
            return;
        }
        if (DEBUG) {
          Log.d(TAG+tag,msg);
        }
    }

    public static void w(String tag, String msg) {
        if (!GLOBAL) {
            return;
        }
        if (WARN) {
          Log.w(TAG+tag,msg);
        }
    }
}
