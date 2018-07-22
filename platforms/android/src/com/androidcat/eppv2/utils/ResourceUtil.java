package com.androidcat.eppv2.utils;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;

import java.lang.reflect.Field;

/**
 * R资源解析器
 *
 * @author savant-pan
 *
 */
public class ResourceUtil {

	/**
	 * 默认资源包名
	 */
	private final static String DEFAULT_PKG_NAME = "cn.com.qdone.android.payment.R";

	/**
	 * 资源包名
	 */
	private static String packageNameR = DEFAULT_PKG_NAME;

	/**
	 * 初始化R资源解析器包名
	 *
	 * @param context
	 */
	public static void init(Context context) {
		packageNameR = context.getPackageName() + ".R";
	}

	/**
	 * 获取String资源ID
	 *
	 * @param stringName
	 *            String资源名
	 * @return
	 */
	public static int getStringId(String stringName) {
		return getResourceId("string", stringName);
	}

	/**
	 * 根据String资源名取String字符串
	 *
	 * @param context
	 *            Context
	 * @param stringName
	 *            String资源名
	 * @return
	 */
	public static String getStringById(Context context, String stringName) {
		final int stringId = getStringId(stringName);
		if (stringId != -1) {
			return context.getString(stringId);
		} else {
			return "Error";
		}
	}

	/**
	 * 获取Color资源ID
	 *
	 * @param colorName
	 *            Color资源名
	 * @return
	 */
	public static int getColorId(String colorName) {
		return getResourceId("color", colorName);
	}

	/**
	 * 获取Anim资源ID
	 * @param animName 文件名
	 * @return
	 */
	public static int getAnimId(String animName) {
		return getResourceId("anim", animName);
	}

	/**
	 * 获取Layout资源ID
	 *
	 * @param layoutName
	 *            Layout资源名（文件名）
	 * @return
	 */
	public static int getLayoutId(String layoutName) {
		return getResourceId("layout", layoutName);
	}

	/**
	 * 获取Drawable资源ID
	 *
	 * @param drawableName
	 *            Drawable资源名（文件名）
	 * @return
	 */
	public static int getDrawableId(String drawableName) {
		return getResourceId("drawable", drawableName);
	}

	/**
	 * 获取Raw资源ID
	 *
	 * @param rawName
	 *            Raw资源名（文件名）
	 * @return
	 */
	public static int getRawId(String rawName) {
		return getResourceId("raw", rawName);
	}

	/**
	 * 获取Layout资源ID
	 *
	 * @param styleName
	 *            Style资源名
	 * @return
	 */
	public static int getStyleId(String styleName) {
		return getResourceId("style", styleName);
	}

	/**
	 * 获取Attr资源ID
	 *
	 * @param attrName
	 *            Attr资源名
	 * @return
	 */
	public static int getAttrId(String attrName) {
		return getResourceId("attr", attrName);
	}

	/**
	 * 获取id资源ID值
	 *
	 * @param idName
	 *            ID资源名
	 * @return
	 */
	public static int getId(String idName) {
		return getResourceId("id", idName);
	}

	/**
	 * 获取id资源ID值
	 *
	 * @param idName
	 *            ID资源名
	 * @return
	 */
	public static int getMenuId(String idName) {
		return getResourceId("menu", idName);
	}

	/**
	 * 取资源ID
	 *
	 * @param resType
	 *            资源类型
	 * @param resName
	 *            资源名（文件名）
	 * @return
	 */
	public static int getResourceId(String resType, String resName) {
		if (packageNameR == null) {
			packageNameR = DEFAULT_PKG_NAME;
		}
		if ((resType != null) && (resName != null)) {
			String resourceName = resName;
			if (resourceName.startsWith("R.")) {
				try {
					int len = resourceName.lastIndexOf(".");
					if (len != -1) {
						resourceName = resourceName.substring(len + 1).replace(" ", "");
					}
				} catch (Exception e) {
				}
			}
			try {
				Class<?> localClass = Class.forName(packageNameR + "$" + resType);
				Field localField = localClass.getField(resourceName);
				Object localObject = localField.get(localClass.newInstance());
				return Integer.parseInt(localObject.toString());
			} catch (Exception localException) {
			}
		}

		return -1;
	}

	/**
	 * 获取应用程序名称
	 *
	 * @param context
	 * @return
	 */
	public static String getApplicationName(Context context) {
		try {
			PackageManager pm = context.getPackageManager();
			PackageInfo packageInfo = pm.getPackageInfo(context.getPackageName(), 0);
			return packageInfo.applicationInfo.loadLabel(pm).toString();
		} catch (NameNotFoundException e) {
			e.printStackTrace();
			return "ERROR";
		}
	}

	/**
	 * 取字替换应用名后的字符串
	 *
	 * @param context
	 * @param strName
	 * @return
	 */
	public static String getAppStringById(Context context, String strName) {
		try {
			final String string = ResourceUtil.getStringById(context, strName);
			final String subStr = getApplicationName(context);
			return String.format(string, subStr);
		} catch (Exception e) {
			e.printStackTrace();
			return "error";
		}
	}
}
