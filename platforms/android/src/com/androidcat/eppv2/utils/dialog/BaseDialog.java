package com.androidcat.eppv2.utils.dialog;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.androidcat.eppv2.utils.ResourceUtil;

/**
 * 自定义对话框基类
 *
 * @author savant
 *
 */
public class BaseDialog {
	private Dialog dialog;
	private TextView titleText;
	private LinearLayout contentLayout;
	private Button postiveBtn;
	private Button negativeBtn;

	private boolean showPostive = false;
	private boolean showNegative = false;
	private boolean cancelable = false;

	protected LayoutInflater inflater;
	protected Context context;
	private LinearLayout operateLay;

	public BaseDialog(Context context) {
		inflater = LayoutInflater.from(context);
		this.context = context;

		dialog = new Dialog(context, ResourceUtil.getStyleId("R.style.dialog_style"));
		dialog.setCancelable(cancelable);
		init();
	}

	protected void init() {
		View view = getInfater().inflate(ResourceUtil.getLayoutId("R.layout.com_basedialog_layout"), null);
		dialog.setContentView(view);

		titleText = (TextView) view.findViewById(ResourceUtil.getId("R.id.dialog_title_text"));
		contentLayout = (LinearLayout) view.findViewById(ResourceUtil.getId("R.id.content_layout"));
		operateLay = (LinearLayout) view.findViewById(ResourceUtil.getId("R.id.operate_lay"));
		postiveBtn = (Button) view.findViewById(ResourceUtil.getId("R.id.dialog_button_confirm"));
		negativeBtn = (Button) view.findViewById(ResourceUtil.getId("R.id.dialog_button_cancel"));

		postiveBtn.setVisibility(View.GONE);
		negativeBtn.setVisibility(View.GONE);
	}

	protected LayoutInflater getInfater() {
		if (inflater == null) {
			inflater = LayoutInflater.from(context);
		}
		return inflater;
	}

	/**
	 * 添加内容区域
	 *
	 * @param view
	 * @param params
	 */
	protected void addContentView(View view, LayoutParams params) {
		if (params == null) {
			params = new LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.WRAP_CONTENT);
		}
		if (view != null) {
			contentLayout.removeAllViews();
			contentLayout.addView(view, params);
			contentLayout.setVisibility(View.VISIBLE);
		}
	}

	/**
	 * 设置标题文字，默认为"提示"
	 *
	 * @param ti
	 * @return
	 */
	public void setTitle(CharSequence ti) {
		if (!TextUtils.isEmpty(ti)) {
			titleText.setText(ti);
		}
	}

	/**
	 * 是否可取消
	 *
	 * @param cancel
	 * @return
	 */
	public void setCancelable(boolean cancel) {
		this.cancelable = cancel;
	}

	/**
	 * 设置标题文字，默认为"提示"
	 *
	 * @param resId
	 * @return
	 */
	public void setTitle(int resId) {
		if (resId != 0) {
			titleText.setText(resId);
		}
	}

	/**
	 * 确定按钮
	 *
	 * @param l
	 * @return
	 */
	public void setPositiveButton(CharSequence cs, ButtonClickListener l) {
		initPositiveButton(cs, l);
	}

	private void initPositiveButton(CharSequence cs, ButtonClickListener l) {
		showPostive = true;
		if (!TextUtils.isEmpty(cs)) {
			postiveBtn.setText(cs);
		} else {
			postiveBtn.setText("确定");
		}

		postiveBtn.setOnClickListener(new MyOnClickListener(postiveBtn, l));
	}

	/**
	 * 取消按钮
	 *
	 * @param l
	 * @return
	 */
	public void setNegativeButton(CharSequence cs, ButtonClickListener l) {
		initNegativeButton(cs, l);
	}

	private void initNegativeButton(CharSequence cs, ButtonClickListener l) {
		showNegative = true;
		if (!TextUtils.isEmpty(cs)) {
			negativeBtn.setText(cs);
		} else {
			negativeBtn.setText("取消");
		}

		negativeBtn.setOnClickListener(new MyOnClickListener(negativeBtn, l));
	}

	public interface ButtonClickListener {
		public static final int BUTTON_POSITIVE = 0;
		public static final int BUTTON_NEGATIVE = 1;

		void onButtonClick(int button, View v);
	}

	/**
	 * 事件处理
	 */
	class MyOnClickListener implements View.OnClickListener {

		private ButtonClickListener listener;

		public MyOnClickListener(View v, ButtonClickListener l) {
			this.listener = l;
		}

		@Override
		public void onClick(View v) {
			dialog.dismiss(); // 都得调用
			if (listener != null) {
				listener.onButtonClick(v == postiveBtn ? ButtonClickListener.BUTTON_POSITIVE
						: ButtonClickListener.BUTTON_NEGATIVE, v);
			}
		}
	};

	/**
	 * 显示对话框
	 */
	public void show() {
		dialog.setCancelable(cancelable);
		if (showNegative) {
			negativeBtn.setVisibility(View.VISIBLE);
		}
		if (showPostive) {
			postiveBtn.setVisibility(View.VISIBLE);
		}
		try {
			if (((Activity) context).isFinishing()) {
				return;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		dialog.show();
	}


	/**
	 * @param showOperate 是否显示操作区(包括postiveBtn和negativeBtn)
	 */
	public void show(Boolean showOperate) {
		dialog.setCancelable(cancelable);
		if (showNegative) {
			negativeBtn.setVisibility(View.VISIBLE);
		}
		if (showPostive) {
			postiveBtn.setVisibility(View.VISIBLE);
		}
		if(!showOperate){
			operateLay.setVisibility(View.GONE);
		}
		try {
			if (((Activity) context).isFinishing()) {
				return;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		dialog.show();
	}

	/**
	 * 消失
	 */
	public void dismiss() {
		if (dialog != null && dialog.isShowing()) {
			dialog.dismiss();
		}
	}
}
