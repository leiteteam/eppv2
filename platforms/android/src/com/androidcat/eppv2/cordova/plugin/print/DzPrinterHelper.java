package com.androidcat.eppv2.cordova.plugin.print;

import android.content.Context;
import android.os.Bundle;

import com.dothantech.lpapi.IAtBitmap;
import com.dothantech.printer.IDzPrinter;

import org.apache.cordova.CallbackContext;

/**
 * Created by androidcat on 2018/7/22.
 */

public class DzPrinterHelper {

  // 打印参数
  private int printQuality = 1;
  private int printDensity = 1;
  private int printSpeed = 1;
  private int gapType = 1;

  public void init(Context context, CallbackContext callbackContext){
    // 调用IDzPrinter对象的init方法初始化对象
    IDzPrinter.Factory.getInstance().init(context, new PrinterInitCallback(callbackContext));
    IDzPrinter.PrinterAddress printerAddress = IDzPrinter.Factory.getFirstPrinter("B50");
    IDzPrinter.Factory.getInstance().connect(printerAddress);
  }

  // 判断当前打印机是否连接
  public boolean isPrinterConnected() {
    // 调用IDzPrinter对象的getPrinterState方法获取当前打印机的连接状态
    IDzPrinter.PrinterState state = IDzPrinter.Factory.getInstance().getPrinterState();

    // 打印机未连接
    if (state == null || state.equals(IDzPrinter.PrinterState.Disconnected)) {
      return false;
    }

    // 打印机正在连接
    if (state.equals(IDzPrinter.PrinterState.Connecting)) {
      return false;
    }

    // 打印机已连接
    return true;
  }

  // 打印二维码
  public boolean print2dBarcode(String twodBarcode, Bundle param) {
    // 创建IAtBitmap对象
    IAtBitmap api = IAtBitmap.Factory.createInstance();

    // 开始绘图任务，传入参数(页面宽度, 页面高度)
    api.startJob(24 * 100, 24 * 100);

    // 开始一个页面的绘制，绘制二维码
    // 传入参数(需要绘制的二维码的数据, 绘制的二维码左上角水平位置, 绘制的二维码左上角垂直位置, 绘制的二维码的宽度(宽高相同))
    api.draw2DQRCode(twodBarcode, 3 * 100, 4 * 100, 13 * 100);

    // 结束绘图任务
    api.endJob();

    // 打印
    return IDzPrinter.Factory.getInstance().print(api, param);
  }

  // 获取打印时需要的打印参数
  public Bundle getPrintParam(int copies, int orientation) {
    Bundle param = new Bundle();

    // 打印浓度
    if (printDensity >= 0) {
      param.putInt(IDzPrinter.PrintParamName.PRINT_DENSITY, printDensity);
    }

    // 打印速度
    if (printSpeed >= 0) {
      param.putInt(IDzPrinter.PrintParamName.PRINT_SPEED, printSpeed);
    }

    // 间隔类型
    if (gapType >= 0) {
      param.putInt(IDzPrinter.PrintParamName.GAP_TYPE, gapType);
    }

    // 打印页面旋转角度
    if (orientation != 0) {
      param.putInt(IDzPrinter.PrintParamName.PRINT_DIRECTION, orientation);
    }

    // 打印份数
    if (copies > 1) {
      param.putInt(IDzPrinter.PrintParamName.PRINT_COPIES, copies);
    }

    return param;
  }
}
