package com.androidcat.eppv2.cordova.plugin.print;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import com.postek.cdf.CDFPTKAndroid;
import com.postek.cdf.CDFPTKAndroidImpl;

import org.json.JSONObject;

public class POSTEKPrintHelper {
    public static CDFPTKAndroid cdf = null;
    public int isPrint(final Context context, String msg){
        cdf = new CDFPTKAndroidImpl(context, null);
        JSONObject data;
        try{
            data = new JSONObject(msg);
        }catch (Exception e){
            return -2;
        }
        try{
            cdf.PTK_DisconnectBluetooth();
        }catch (Exception e){
        }
        int status = cdf.PTK_ConnectBluetooth(data.optString("address"));
        Log.i("链接状态：",status+"");
        if (status == 1) {
            // 连接失败
            return status;
        } else {
            // 连接成功
            cdf.PTK_ClearBuffer();
            cdf. PTK_SetDarkness(10);
            cdf.PTK_SetLabelHeight (560, 20,0, false);
            cdf.PTK_SetLabelWidth(400);
            cdf.PTK_DrawBar2D_QR(100,150,240, 240,0,9,1,1,8,"\""+ data.optString("printCode") + "\"");
            cdf.PTK_DrawAndroidText(60,370,22,4,"N","Noto",data.optString("printTitle"));
            status = cdf.PTK_PrintLabel(1,1);
        }
        return status;
    }
}