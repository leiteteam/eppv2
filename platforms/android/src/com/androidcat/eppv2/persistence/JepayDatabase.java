package com.androidcat.eppv2.persistence;

import android.content.Context;

import com.androidcat.eppv2.persistence.bean.TaskData;
import com.androidcat.eppv2.persistence.bean.Track;
import com.androidcat.eppv2.persistence.bean.UserInfo;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.lidroid.xutils.DbUtils;
import com.lidroid.xutils.DbUtils.DaoConfig;
import com.lidroid.xutils.db.sqlite.Selector;
import com.lidroid.xutils.exception.DbException;
import com.androidcat.eppv2.persistence.bean.KeyValue;
import com.androidcat.eppv2.utils.log.LogUtil;

import java.util.ArrayList;
import java.util.List;


/**
 *
 * **********************************************************<br>
 * 模块功能: 封装了对sqlite数据库的管理，并提供里对各个表操作的业务方法<br>
 * 作 者: 薛龙<br>
 * 开发日期：2013-8-7 下午13:44:33
 * 单 位：武汉天喻信息 研发中心
 * 修改日期：<br>
 * 修改人：<br>
 * 修改说明：<br>
 * *********************************************************<br>
 */
public class JepayDatabase {
	// log tag
	protected static final String TAG = "JepayDatabase";
	public static final String DATABASE_FILE = "JepayDatabase.db";

	/**
	 * 该常量字段
	 */
	private static int DATABASE_VERSION = 2;

	private static JepayDatabase mInstance = null;
	private static DbUtils mDbUtils;

	private static Context mContext;

	private JepayDatabase() {
		// Singleton only, use getInstance()
	}

	public static synchronized JepayDatabase getInstance(Context context) {
		mContext = context;
		if (mInstance == null){
			mInstance = new JepayDatabase();
			DaoConfig config = new DaoConfig(mContext);
			config.setDbName(DATABASE_FILE);
			config.setDbVersion(DATABASE_VERSION);
			config.setDbUpgradeListener(new DbUtils.DbUpgradeListener() {
				@Override
				public void onUpgrade(DbUtils dbUtils, int oldVer, int newVer) {
					upgradeDatabase(dbUtils,oldVer,newVer);
				}
			});
			mDbUtils = DbUtils.create(config);
			mDbUtils.configAllowTransaction(true);
		}
		return mInstance;
	}

	private static void upgradeDatabase(DbUtils dbUtils, int oldVer, int newVer) {
		LogUtil.e(TAG, "数据库版本不一致，进入升级数据库流程");
		LogUtil.e(TAG, "当前数据库版本：" + oldVer + "  ----需升级到：" + newVer);
		try{
			//数据库版本为2时，因表结构发生变化，重新启用数据库升级策略
			if (newVer == 2){
				//本次数据库升级需修改表字段，需先删除就task表
				dbUtils.dropTable(TaskData.class);
				com.androidcat.utilities.LogUtil.e(TAG, "----删除旧版TaskData表，新增track字段----");
			}
      dbUtils.createTableIfNotExist(KeyValue.class);
      dbUtils.createTableIfNotExist(TaskData.class);
      dbUtils.createTableIfNotExist(Track.class);
      dbUtils.createTableIfNotExist(UserInfo.class);
		}catch (Exception e){
      LogUtil.e(TAG, e.getMessage());
		}
	}

	public boolean saveCacheData(KeyValue cacheData){
		if (mDbUtils == null){
			return false;
		}
		try {
			mDbUtils.saveOrUpdate(cacheData);
			return true;
		} catch (DbException e) {
			e.printStackTrace();
			return false;
		}
	}

	public String getCacheData(String key){
		if (mDbUtils == null){
			return null;
		}
		try {
			KeyValue keyValue = mDbUtils.findById(KeyValue.class,key);
			return keyValue == null? null:keyValue.value;
		} catch (DbException e) {
			e.printStackTrace();
			return null;
		}
	}

	public List<TaskData> getUndoneTaskList(String userid){
    if (mDbUtils == null){
      return new ArrayList<TaskData>();
    }
    try {
      List<TaskData> taskList = mDbUtils.findAll(Selector.from(TaskData.class).where("userid","=",userid).and("state","=","0"));
      if(taskList == null){
          return new ArrayList<TaskData>();
      }
      return taskList;
    } catch (DbException e) {
      e.printStackTrace();
      return new ArrayList<TaskData>();
    }
  }

  public List<TaskData> getDoneTaskList(String userid){
    if (mDbUtils == null){
      return new ArrayList<TaskData>();
    }
    try {
      List<TaskData> taskList = mDbUtils.findAll(Selector.from(TaskData.class).where("userid","=",userid).and("state","=","1"));
      if(taskList == null){
          return new ArrayList<TaskData>();
      }
      return taskList;
    } catch (DbException e) {
      e.printStackTrace();
      return new ArrayList<TaskData>();
    }
  }

  public boolean updateTaskData(TaskData taskData){
    if (mDbUtils == null){
      return false;
    }
    try {
      mDbUtils.replace(taskData);
      return true;
    } catch (DbException e) {
      e.printStackTrace();
      return false;
    }
  }

  public boolean updateTaskData(String taskid,String samples){
    if (mDbUtils == null){
      return false;
    }
    try {
      TaskData taskData = getTaskData(taskid);
      if (taskData != null){
        taskData.samples = samples;
        mDbUtils.replace(taskData);
      }
      return true;
    } catch (DbException e) {
      e.printStackTrace();
      return false;
    }
  }

  public String updateTaskDataWithTrack(String taskid){
    if (mDbUtils == null){
      return "";
    }
    List<Track> tracks = getTrackList(taskid);
    String track = new Gson().toJson(tracks,new TypeToken<List<Track>>(){}.getType());
    return track;
  }

  public boolean updateTaskDataList(List<TaskData> list){
    if (mDbUtils == null){
      return false;
    }
    try {
      for (TaskData taskData :list){
        TaskData localData = getTaskData(taskData.taskid);
        if (localData != null && localData.state == 1){
          continue;
        }
        mDbUtils.replace(taskData);
      }
      return true;
    } catch (DbException e) {
      e.printStackTrace();
      return false;
    }
  }

  public boolean updateTaskDataToUploaded(List<String> list){
    if (mDbUtils == null){
      return false;
    }
    try {
      for (String taskid :list){
        TaskData localData = getTaskData(taskid);
        localData.state = 2;
        mDbUtils.replace(localData);
      }
      return true;
    } catch (DbException e) {
      e.printStackTrace();
      return false;
    }
  }

  public TaskData getTaskData(String taskid){
    if (mDbUtils == null){
      return null;
    }
    try {
      return mDbUtils.findById(TaskData.class,taskid);
    } catch (DbException e) {
      e.printStackTrace();
      return null;
    }
  }

  public long getUndoneTaskCount(String userid){
    if (mDbUtils == null){
      return 0;
    }
    try {
      return mDbUtils.count(Selector.from(TaskData.class).where("userid","=",userid).and("state","=","0"));
    } catch (DbException e) {
      e.printStackTrace();
      return 0;
    }
  }

  public long getDoneTaskCount(String userid){
    if (mDbUtils == null){
      return 0;
    }
    try {
      return mDbUtils.count(Selector.from(TaskData.class).where("userid","=",userid).and("state","=","1"));
    } catch (DbException e) {
      e.printStackTrace();
      return 0;
    }
  }


  //////////////////////////////////////////////用户信息相关//////////////////////////////////////////////////////

  public UserInfo getUserInfo(String username){
    if (mDbUtils == null){
      return null;
    }
    try {
      return mDbUtils.findById(UserInfo.class,username);
    } catch (DbException e) {
      e.printStackTrace();
      return null;
    }
  }

  public boolean updateUserInfo(UserInfo userInfo){
    if (mDbUtils == null){
      return false;
    }
    try {
      mDbUtils.replace(userInfo);
      return true;
    } catch (DbException e) {
      e.printStackTrace();
      return false;
    }
  }


  /////////////////////////////////////////gpsTrack///////////////////////////////////////////////////
  public void savePoint(Track track){
    if (mDbUtils == null){
      return;
    }
    try {
      mDbUtils.save(track);
      return ;
    } catch (DbException e) {
      e.printStackTrace();
      return ;
    }
  }

  public List<Track> getTrackList(String taskid){
    if (mDbUtils == null){
      return new ArrayList<Track>();
    }
    try {
      List<Track> trackList = mDbUtils.findAll(Selector.from(Track.class).where("taskid","=",taskid));
      if(trackList == null){
        return new ArrayList<Track>();
      }
      return trackList;
    } catch (DbException e) {
      e.printStackTrace();
      return new ArrayList<Track>();
    }
  }

}
