package typluginnative;

import android.util.Log;

import com.androidcat.eppv2.cordova.manager.TyPluginManager;
import com.androidcat.eppv2.cordova.plugin.ITyPlugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * This class echoes a string called from JavaScript.
 */
public class TYNative extends CordovaPlugin implements ITyPlugin {

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    if (action == null) return false;
    Log.d("TYNative", "action:" + action);
    String message = args.getString(0);
    if (message != null) {
      Log.d("TYNative", "message:" + message);
      if (action.equals("coolMethod")) {
        this.coolMethod(message, callbackContext);
        return true;
      } else if (action.equals("userLogin")) {
        this.userLogin(message, callbackContext);
        return true;
      } else if (action.equals("post")) {
        this.post(message, callbackContext);
        return true;
      } else if (action.equals("get")) {
        this.get(message, callbackContext);
        return true;
      } else if (action.equals("getString")) {
        this.getString(message, callbackContext);
        return true;
      } else if (action.equals("saveString")) {
        this.saveString(message, callbackContext);
        return true;
      } else if (action.equals("push")) {
        this.push(message, callbackContext);
        return true;
      } else if (action.equals("uploadfileWithBase64String")) {
        this.uploadfileWithBase64String(message, callbackContext);
        return true;
      }
    }
    return false;
  }

  @Override
  public void coolMethod(String message, CallbackContext callbackContext) {
    if (message != null && message.length() > 0) {
      callbackContext.success(message);
    } else {
      callbackContext.error("Expected one non-empty string argument.");
    }
  }

  @Override
  public void userLogin(String message, CallbackContext callbackContext) {
    TyPluginManager.userLogin(cordova.getActivity(), message, callbackContext);
  }

  @Override
  public void post(String message, CallbackContext callbackContext) {
    TyPluginManager.post(cordova.getActivity(), message, callbackContext);
  }

  @Override
  public void get(String message, CallbackContext callbackContext) {
    TyPluginManager.get(cordova.getActivity(), message, callbackContext);
  }

  @Override
  public void getString(String message, CallbackContext callbackContext) {
    TyPluginManager.getString(cordova.getActivity(), message, callbackContext);
  }

  @Override
  public void saveString(String message, CallbackContext callbackContext) {
    TyPluginManager.saveString(cordova.getActivity(), message, callbackContext);
  }

  @Override
  public void push(final String message,final CallbackContext callbackContext) {
    cordova.getThreadPool().execute(new Runnable() {
      @Override
      public void run() {
        TyPluginManager.push(TYNative.this, message, callbackContext,webView);
      }
    });
  }

  @Override
  public void uploadfileWithBase64String(final String message, final CallbackContext callbackContext) {
    cordova.getThreadPool().execute(new Runnable() {
      @Override
      public void run() {
        TyPluginManager.uploadFileWithBase64String(cordova.getActivity(), message, callbackContext);
      }
    });
  }
}
