package com.androidcat.eppv2.utils.dialog;

import android.app.Activity;
import android.app.Dialog;
import android.os.Handler;
import android.os.Message;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.androidcat.eppv2.utils.ResourceUtil;


/**
 * 可自动消失对话框
 *
 * @author savant
 *
 */
public class FadeoutDialog {
    private Dialog alertDialog;
    private LayoutInflater layoutInflater;

    /**
     * 可自动消失对话框
     *
     * @param activity
     */
    protected FadeoutDialog(Activity activity) {
        this.alertDialog = new Dialog(activity, ResourceUtil.getStyleId("R.style.dialog_style"));
        this.layoutInflater = LayoutInflater.from(activity);
    }

    /**
     * 创建
     *
     * @param activity
     * @return
     */
    public static FadeoutDialog create(Activity activity) {
        return new FadeoutDialog(activity);
    }

    /**
     * 设置图标及文字
     *
     * @param drawable
     * @param message
     * @return
     */
    public FadeoutDialog setDialog(int drawable, String message) {
        final View view = layoutInflater.inflate(ResourceUtil.getLayoutId("R.layout.com_alertmessage_layout"), null);
        final TextView textView = (TextView) view.findViewById(ResourceUtil.getId("R.id.textView"));
        final ImageView imageView = (ImageView) view.findViewById(ResourceUtil.getId("R.id.imageView"));
        imageView.setImageResource(drawable);
        textView.setText(message);
        this.alertDialog.setContentView(view);
        this.alertDialog.setCancelable(false);
        return this;
    }

    /**
     * 显示
     */
    public void show() {
        this.alertHandler.postDelayed(alertDelayer, 1000);
        this.alertDialog.show();
    }

    /**
     * dismiss Handler
     */
    private Handler alertHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            if (alertDialog != null && alertDialog.isShowing()) {
                alertDialog.dismiss();
            }
        }
    };

    /**
     * 延时Task
     */
    private Runnable alertDelayer = new Runnable() {
        @Override
        public void run() {
            if (alertHandler != null) {
                alertHandler.sendEmptyMessage(0);
            }
        }
    };
}
