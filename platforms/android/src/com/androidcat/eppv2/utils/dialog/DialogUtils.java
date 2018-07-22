package com.androidcat.eppv2.utils.dialog;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.androidcat.eppv2.R;
import com.androidcat.utilities.Utils;

public class DialogUtils {

	/**
	 * 显示自动消失提醒对话框
	 *
	 * @param activity
	 * @param drawable
	 * @param resId
	 */
	public static void showAlertDialog(Activity activity, int drawable, int resId) {
		showAlertDialog(activity, drawable, activity.getString(resId));
	}

	/**
	 * 显示自动消失提醒对话框
	 *
	 * @param activity
	 * @param drawable
	 * @param message
	 */
	public static void showAlertDialog(Activity activity, int drawable, String message) {
		FadeoutDialog.create(activity).setDialog(drawable, message).show();
	}

	/**
	 * 显示文本对话框(自写Title)
	 *
	 * @param activity
	 * @param title
	 * @param message
	 * @param listener
	 */
	public static void showTextDialog(Activity activity, String title, String message, BaseDialog.ButtonClickListener listener) {
		if (activity != null && !activity.isFinishing()) {
			TextDialog.createDialog(activity).setTitle(title).setMessage(message).setCancelable(false)
					.setPositiveButton(listener).setNegativeButton(listener).show();
		} else {
			return;
		}
	}

	/**
	 * 显示文本对话框(Title=提示)，仅一个按钮
	 *
	 * @param activity
	 * @param message
	 * @param listener
	 */
	public static void showTextSingleDialog(Activity activity, String message, BaseDialog.ButtonClickListener listener) {
		if (activity != null && !activity.isFinishing()) {
			TextDialog.createDialog(activity).setMessage(message).setPositiveButton(listener).show();
		} else {
			return;
		}
	}

	/**
	 * 显示文本对话框(Title=提示)，仅一个按钮
	 *
	 * @param activity
	 * @param message
	 * @param listener
	 * @param gravity
	 */
	public static void showTextSingleDialog(Activity activity, String message, BaseDialog.ButtonClickListener listener, int gravity) {
		if (activity != null && !activity.isFinishing()) {
			TextDialog.createDialog(activity).setMessage(message, gravity).setPositiveButton(listener).show();
		} else {
			return;
		}
	}

	/**
	 * 显示文本对话框(Title=提示)
	 *
	 * @param activity
	 * @param message
	 * @param listener
	 */
	public static void showTextDialog(Activity activity, String message, BaseDialog.ButtonClickListener listener) {
		if (activity != null && !activity.isFinishing()) {
			TextDialog.createDialog(activity).setMessage(message).setCancelable(false).setPositiveButton(listener)
					.setNegativeButton(listener).show();
		} else {
			return;
		}
	}

	/**
	 * 显示文本对话框(Title=提示)
	 *
	 * @param activity
	 * @param message
	 * @param listener
	 */
	public static void showTextDialog(Activity activity, String message, View view, BaseDialog.ButtonClickListener listener) {
		if (activity != null && !activity.isFinishing()) {
			TextDialog.createDialog(activity).setMessage(message).setCancelable(false).setPositiveButton(listener)
			.setNegativeButton(listener).setContentLayout(view).show();
		} else {
			return;
		}
	}

	/**
	 * 显示文本对话框(Title=提示)
	 *
	 * @param activity
	 * @param message
	 * @param positiveListener
	 */
	public static void showTextDialog(Activity activity, String message, BaseDialog.ButtonClickListener positiveListener,
									  BaseDialog.ButtonClickListener negativeListener, String positiveName) {
		if (activity != null && !activity.isFinishing()) {
			TextDialog dialog = TextDialog.createDialog(activity).setMessage(message).setCancelable(false)
					.setPositiveButton(positiveName, positiveListener).setNegativeButton("删除本卡", negativeListener)
					.setCancelable(true);
			dialog.show();
		} else {
			return;
		}
	}

	/**
	 * 显示文本对话框(Title=提示)
	 *
	 * @param activity
	 * @param message
	 * @param positiveListener
	 */
	public static void showTextDialog(Activity activity, String message, BaseDialog.ButtonClickListener positiveListener,
									  BaseDialog.ButtonClickListener negativeListener, String positiveName, String negativeName) {
		if (activity != null && !activity.isFinishing()) {
			TextDialog dialog = TextDialog.createDialog(activity).setMessage(message).setCancelable(false)
					.setPositiveButton(positiveName, positiveListener).setNegativeButton(negativeName, negativeListener);
			dialog.show();
		} else {
			return;
		}
	}

	/**
	 * 显示文本对话框(Title=提示)
	 *
	 * @param activity
	 * @param message
	 * @param listener
	 */
	public static void showTextDialog(Activity activity, String message, int gravity, BaseDialog.ButtonClickListener listener) {
		if (activity != null && !activity.isFinishing()) {
			TextDialog.createDialog(activity).setMessage(message, gravity).setCancelable(false)
					.setPositiveButton(listener).setNegativeButton(listener).show();
		} else {
			return;
		}
	}

  //版本更新是否要更新的对话框
  public static Dialog getUpdateDialog(final Context context, String msg, String confirmBtnTxt, View.OnClickListener onClickListener, String cancelTxt, View.OnClickListener onClickListener1) {
    final Dialog dialog = new Dialog(context, R.style.normalDialog);
    if (null == dialog) {
      return null;
    }

    dialog.setContentView(R.layout.update_dialog);
    dialog.setCanceledOnTouchOutside(false);

    TextView tv_dialog_msg = (TextView) dialog.findViewById(R.id.tv_title);
    String temp = "新版本号" + msg;
    tv_dialog_msg.setText(temp);
    TextView tv_nfc_confirm = (TextView) dialog.findViewById(R.id.tv_nfc_confirm);
    tv_nfc_confirm.setText(confirmBtnTxt);
    tv_nfc_confirm.setOnClickListener(onClickListener);
    final LinearLayout m_layout_btn = (LinearLayout) dialog.findViewById(R.id.layout_btn);
    final LinearLayout m_layout_progress = (LinearLayout) dialog.findViewById(R.id.layout_progress);

    TextView tv_nfc_cancel = (TextView) dialog.findViewById(R.id.tv_nfc_cancel);
    if (cancelTxt != null) {
      tv_nfc_cancel.setVisibility(View.VISIBLE);
      tv_nfc_cancel.setOnClickListener(onClickListener1);
      tv_nfc_cancel.setText(cancelTxt);
    } else {
      tv_nfc_cancel.setVisibility(View.GONE);
    }
    return dialog;
  }

}
