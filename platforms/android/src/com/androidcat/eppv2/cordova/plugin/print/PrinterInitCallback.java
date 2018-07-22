package com.androidcat.eppv2.cordova.plugin.print;

import com.dothantech.printer.IDzPrinter;

import org.apache.cordova.CallbackContext;

/**
 * Created by androidcat on 2018/7/22.
 */

public class PrinterInitCallback implements IDzPrinter.IDzPrinterCallback {

  private CallbackContext callbackContext;

  public PrinterInitCallback(CallbackContext cbc){
    this.callbackContext = cbc;
  }

  @Override
  public void onProgressInfo(IDzPrinter.ProgressInfo progressInfo, Object o) {

  }

  @Override
  public void onStateChange(IDzPrinter.PrinterAddress printerAddress, IDzPrinter.PrinterState printerState) {
    final IDzPrinter.PrinterAddress printer = printerAddress;
    switch (printerState) {
      case Connected:
      case Connected2:
        callbackContext.success("连接成功");
        break;

      case Disconnected:
        // 打印机连接失败、断开连接，发送通知，刷新界面提示
        callbackContext.error("连接失败");
        break;

      default:
        break;
    }
  }

  @Override
  public void onPrintProgress(IDzPrinter.PrinterAddress printerAddress, Object o, IDzPrinter.PrintProgress printProgress, Object o1) {

  }

  @Override
  public void onPrinterDiscovery(IDzPrinter.PrinterAddress printerAddress, IDzPrinter.PrinterInfo printerInfo) {

  }
}
