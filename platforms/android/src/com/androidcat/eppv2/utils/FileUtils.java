package com.androidcat.eppv2.utils;

import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import android.content.Context;
import android.os.Environment;

import com.androidcat.eppv2.utils.log.LogUtil;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;


public class FileUtils {

	private static final String CONFIG_SD_FILE = "new_payentry.txt";
	private static final String SDCARD_CACHE_PATH = "/qdpay_base";

	/**
	 * 判断当前应用程序处于前台还是后台
	 *
	 * @param context
	 * @return
	 */
	public static boolean isForeground(Context context) {
		ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
		List<RunningAppProcessInfo> appProcesses = activityManager.getRunningAppProcesses();
		for (RunningAppProcessInfo appProcess : appProcesses) {
			if (appProcess.processName.equals(context.getPackageName())) {
				if (appProcess.importance != RunningAppProcessInfo.IMPORTANCE_BACKGROUND) {
					LogUtil.d("ApplicationUtils", "Foreground App:" + appProcess.processName);
					return true;
				} else {
					LogUtil.d("ApplicationUtils", "Background App:" + appProcess.processName);
					return false;
				}
			}
		}
		return false;
	}

	/**
	 * 检测是否有SD卡[有则清空程序目录下文件]
	 *
	 * @param context
	 * @return
	 */
	public static boolean hasSDCard(Context context) {
		boolean flag = Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED);
		if (flag) {
			try {
				final File dir = new File(getAppDir());
				if (!dir.exists()) {
					dir.mkdir();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return flag;
	}

	/**
	 * 取应用SD卡目录
	 *
	 * @return
	 */
	public static String getAppDir() {
		return Environment.getExternalStorageDirectory().toString() + SDCARD_CACHE_PATH;
	}

	/**
	 * 取应用相册目录
	 *
	 * @return
	 */
	public static String getCameraFir() {
		return Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES).getPath();
	}

	/**
	 * 重置应用SD卡目录
	 */
	public static void resetAppDir(Context context) {
		if (hasSDCard(context)) {
			try {
				final File dir = new File(getAppDir());
				for (File t : dir.listFiles()) {
					t.delete();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}


	public static boolean isConfigExist() {
		  File file = new File(Environment.getExternalStorageDirectory().toString() + File.separator+CONFIG_SD_FILE);
		  return file.exists();
	}

	public static void writeFileToSD(String s) {
		String sdStatus = Environment.getExternalStorageState();
		// 获取SDCard状态,如果SDCard插入了手机且为非写保护状态
		if (!sdStatus.equals(Environment.MEDIA_MOUNTED)) {
			LogUtil.e("SD卡不存在");
			return;
		}
		try {
			String fileName = "huanggangshifan.txt";
			File file = new File(Environment.getExternalStorageDirectory()
					+ "/" + fileName);
			if (!file.exists()) {
				file.createNewFile();
			}
			// 一个参数默认是覆盖原来的文件内容的，可以构造的时候传两个参数第二个设置成true表示追加
			FileOutputStream stream = new FileOutputStream(file);
			byte[] buf = s.getBytes();
			stream.write(buf);
			stream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	 /**
     * 读取SD卡中文本文件
     * @return
     */
    public static String readSDFile() {
        File file = new File(Environment.getExternalStorageDirectory().toString() + File.separator+CONFIG_SD_FILE);
        FileInputStream fis=null;

        try {
           fis = new FileInputStream(file);

    		ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
    		byte[] bytes = new byte[4096];
    		int len = 0;
    		while ((len = fis.read(bytes)) > 0) {
    			byteStream.write(bytes, 0, len);
    		}

    		return new String(byteStream.toByteArray(), "UTF-8");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return null;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } finally {
        	if(fis!=null) {
        		  try {
      				fis.close();
      			} catch (IOException e) {
      				e.printStackTrace();
      			}
        	}
        }

    }
  /**
	 * E货物流拍照照片的目录
	 */
	public static File getCacheDirectory() {
		File DatalDir = Environment.getExternalStorageDirectory();
		File myDir = new File(DatalDir, "/DCIM/Camera");
		myDir.mkdirs();
		String mDirectoryname = DatalDir.toString() + "/DCIM/Camera";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-hhmmss",Locale.SIMPLIFIED_CHINESE);
		File tempfile = new File(mDirectoryname, sdf.format(new Date()) + ".jpg");
		if (tempfile.isFile())
		tempfile.delete();
		return tempfile;
	}

}
