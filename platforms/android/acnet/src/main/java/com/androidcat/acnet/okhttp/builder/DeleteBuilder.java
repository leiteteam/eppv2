package com.androidcat.acnet.okhttp.builder;

import com.androidcat.acnet.okhttp.MyOkHttp;
import com.androidcat.acnet.okhttp.callback.IResponseHandler;
import com.androidcat.acnet.okhttp.callback.MyCallback;
import com.androidcat.acnet.okhttp.util.LogUtils;

import okhttp3.Request;

/**
 * delete builder
 * Created by tsy on 2016/12/6.
 */

public class DeleteBuilder extends OkHttpRequestBuilder<DeleteBuilder> {

    public DeleteBuilder(MyOkHttp myOkHttp) {
        super(myOkHttp);
    }

    @Override
    public void enqueue(final IResponseHandler responseHandler) {
        try {
            if(mUrl == null || mUrl.length() == 0) {
                throw new IllegalArgumentException("url can not be null !");
            }

            Request.Builder builder = new Request.Builder().url(mUrl).delete();
            appendHeaders(builder, mHeaders);

            if (mTag != null) {
                builder.tag(mTag);
            }

            Request request = builder.build();

            mMyOkHttp.getOkHttpClient()
                    .newCall(request)
                    .enqueue(new MyCallback(responseHandler));
        } catch (Exception e) {
            LogUtils.e("Delete enqueue error:" + e.getMessage());
            responseHandler.onFailure(0, e.getMessage());
        }
    }
}

