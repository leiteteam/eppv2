package com.androidcat.eppv2.cordova.plugin.print;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Handler;
import android.util.Log;

import com.postek.cdf.CDFPTKAndroid;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONObject;


public class BluetoothSearch {
    //蓝牙
    public BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    private Runnable stopSPPScanRunnable;
    private IntentFilter intentFilter;
    private static JSONArray devices = null;
    private CallbackContext mCallbackContext;
    private Handler mHandler;
    {
        mHandler = new Handler() {
        };
    }
    public void search(final Context context, final CallbackContext callbackContext){
        this.mCallbackContext = callbackContext;
        IntentFilter filter = new IntentFilter(
                BluetoothAdapter.ACTION_DISCOVERY_STARTED);
        context.registerReceiver(receiver, filter);
        filter=new IntentFilter(BluetoothDevice.ACTION_FOUND);
        context.registerReceiver(receiver,filter);
        filter=new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
        context.registerReceiver(receiver,filter);
        try {
            enableBlueTooth();
        } catch (Exception e){
            Log.e("bluetooth", e.getMessage());
        }
        context.registerReceiver(receiver, getIntentFilter());
        if (bluetoothAdapter == null) return;
        // 先停止搜索
        stopSearch();
        devices = null;
        devices = new JSONArray();
        Log.i("****devices", devices.toString());
        // 设置Runnable
        setupRunnable();
        mHandler.postDelayed(stopSPPScanRunnable, 30000);// 搜索30s
        bluetoothAdapter.startDiscovery();
    }
    public static void getSearch(final CallbackContext callbackContext){
        callbackContext.success(devices);
    }
    public synchronized void stopSearch(){
        bluetoothAdapter.cancelDiscovery();
    }
    private final BroadcastReceiver receiver=new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            final String action = intent.getAction();
            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                final BluetoothDevice deviceGet = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                Log.i("找到设备", deviceGet.getAddress());
                //信号强度。
                final int rssi = intent.getExtras().getShort(BluetoothDevice.EXTRA_RSSI);
                Log.i(deviceGet.getName(),deviceGet.getName() + "," + deviceGet.getAddress());
                JSONObject device = new JSONObject();
                try{
                    if(deviceGet.getAddress() != null && !deviceGet.getAddress().equals("")){
                        device.putOpt("name", deviceGet.getName());
                        device.putOpt("address", deviceGet.getAddress());
                        if(!devices.toString().contains(deviceGet.getAddress())){
                            devices.put(device);
                        }
                    }
                }catch (Exception e){
                    Log.e("bluetooth", e.getMessage());
                }
                //deviceFound(deviceGet, rssi);
            }else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)) {
                Log.i("finish","finish");
            }else if (BluetoothAdapter.ACTION_DISCOVERY_STARTED.equals(action)){
                Log.i("searching...","searching...");
                mCallbackContext.success("searching");
            }
            else if(BluetoothDevice.ACTION_BOND_STATE_CHANGED.equals(action)){
                final BluetoothDevice deviceGet = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                switch (deviceGet.getBondState()){
                    case BluetoothDevice.BOND_BONDING://正在配对
                        Log.d("BlueToothTestActivity", "正在配对......");
                        // searchDevices.setText("正在配对......");
                        break;
                    case BluetoothDevice.BOND_BONDED://配对结束
                        Log.d("BlueToothTestActivity", "完成配对");

                        break;
                    case BluetoothDevice.BOND_NONE://取消配对/未配对
                        Log.d("BlueToothTestActivity", "取消配对");

                    default:
                        break;
                }

            }

        }
    };
    private void setupRunnable() {
        if (stopSPPScanRunnable == null){
            stopSPPScanRunnable = new Runnable() {
                @Override
                public void run() {
                    bluetoothAdapter.cancelDiscovery();
                }
            };
        }
    }
    //判断蓝牙是否开启
    public void enableBlueTooth() throws Exception {
        this.bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter == null) {
            throw new Exception("设备上没有发现有蓝牙设备");
        }
        if (!bluetoothAdapter.isEnabled()) {
            bluetoothAdapter.enable();
        }
    }
    public IntentFilter getIntentFilter(){
        if (intentFilter == null){
            intentFilter = new IntentFilter();
            intentFilter.addAction(BluetoothDevice.ACTION_FOUND);
            intentFilter.addAction(BluetoothDevice.ACTION_BOND_STATE_CHANGED);
            intentFilter.addAction(BluetoothDevice.ACTION_ACL_CONNECTED);
            intentFilter.addAction(BluetoothDevice.ACTION_ACL_DISCONNECTED);
            intentFilter.addAction(BluetoothDevice.ACTION_ACL_DISCONNECT_REQUESTED);
            //        intentFilter.addAction(BluetoothAdapter.ACTION_SCAN_MODE_CHANGED);
            intentFilter.addAction(BluetoothAdapter.ACTION_DISCOVERY_STARTED);
            intentFilter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
            intentFilter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);
            intentFilter.addAction(BluetoothAdapter.ACTION_CONNECTION_STATE_CHANGED);
        }
        return intentFilter;
    }
}