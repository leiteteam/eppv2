package com.androidcat.eppv2.utils.dialog;


import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.TextView;

import com.androidcat.eppv2.utils.ResourceUtil;


/**
 * 自定义文本对话框
 *
 * @author savant
 *
 */
public class TextDialog {
    private static TextDialogUtils dialog;
    private Context context;

    public TextDialog(Context context) {
    	this.context = context;
        dialog = new TextDialogUtils(context, ResourceUtil.getLayoutId("R.layout.com_textdialog_layout"));
    }

    /**
     * 文本对话框
     */
    private class TextDialogUtils extends BaseDialog {
        private TextView textView;

        public TextDialogUtils(Context context, int resId) {
            super(context);

            View view = getInfater().inflate(resId, null);
            this.textView =  (TextView) view.findViewById(ResourceUtil.getId("R.id.message"));
            this.addContentView(view, null);
        }

        @Override
        protected void addContentView(View view, LayoutParams params) {
            super.addContentView(view, params);
        }

        public void setMessage(CharSequence message) {
            textView.setText(message);
            setMessage(message, Gravity.CENTER);
        }

        public void setMessage(CharSequence message, int gravity) {
            textView.setGravity(gravity);
            textView.setText(message);
        }
    }

    public static TextDialog createDialog(Context context) {
        return new TextDialog(context);
    }

    public TextDialog setTitle(CharSequence title) {
        dialog.setTitle(title);
        return this;
    }

    public TextDialog setMessage(CharSequence message) {
        dialog.setMessage(message);
        return this;
    }

    public TextDialog setMessage(CharSequence message, int gravity) {
        dialog.setMessage(message, gravity);
        return this;
    }

    public TextDialog setPositiveButton(BaseDialog.ButtonClickListener li) {
        dialog.setPositiveButton(ResourceUtil.getStringById(context,"R.string.app_confirm"), li);
        return this;
    }

    public TextDialog setNegativeButton(BaseDialog.ButtonClickListener li) {
        dialog.setNegativeButton(ResourceUtil.getStringById(context,"R.string.app_cancel"), li);
        return this;
    }

    public TextDialog setPositiveButton(String buttonText, BaseDialog.ButtonClickListener li) {
        dialog.setPositiveButton(buttonText, li);
        return this;
    }

    public TextDialog setNegativeButton(String buttonText, BaseDialog.ButtonClickListener li) {
        dialog.setNegativeButton(buttonText, li);
        return this;
    }

    public TextDialog setCancelable(boolean cancel) {
        dialog.setCancelable(cancel);
        return this;
    }

    public TextDialog setContentLayout(View view) {
        dialog.addContentView(view, null);
        return this;
    }

    public void show() {
        dialog.show();
    }

    public static void dismiss() {
    	dialog.dismiss();
    }
}
