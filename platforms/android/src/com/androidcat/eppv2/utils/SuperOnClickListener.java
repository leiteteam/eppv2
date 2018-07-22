package com.androidcat.eppv2.utils;

import android.app.Activity;
import android.view.View;
import android.widget.TextView;

import com.androidcat.eppv2.application.AppConfig;

public class SuperOnClickListener implements View.OnClickListener {
	private String text;
	private Activity mActivity;

	public SuperOnClickListener(Activity activity, String text) {
		this.mActivity = activity;
		this.text = text;
	}

	public SuperOnClickListener(Activity activity) {
		this.mActivity = activity;
		this.text = null;
	}

	@Override
	public void onClick(View v) {
		try{
			if (this.text == null && v instanceof TextView) {
				try {
					text = ((TextView) v).getText().toString();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

			if (this.text == null) {
				this.text = "未知";
			}
		} catch (Exception e){

		}
	}
}
