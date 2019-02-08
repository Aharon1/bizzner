package com.bizzner;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.reactlibrary.linkedinsdk.RNLinkedInSessionManagerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.imagepicker.ImagePickerPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

import com.oblador.vectoricons.VectorIconsPackage;
import com.reactlibrary.linkedinsdk.RNLinkedInSessionManagerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new VectorIconsPackage(),
            new ReactNativePushNotificationPackage(),
            new MapsPackage(),
            new RNLinkedInSessionManagerPackage(),
            new RNGestureHandlerPackage(),
            new RNFusedLocationPackage(),
            new ImagePickerPackage(),
            new ReactNativePushNotificationPackage(),
            new VectorIconsPackage(),
            new RNLinkedInSessionManagerPackage(),
            new RNGestureHandlerPackage(),
            new MapsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
