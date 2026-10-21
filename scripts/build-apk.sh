#!/usr/bin/env bash
set -e

echo "=== Building Production Android APK for ZaFoot ==="
BUILD_DIR="/tmp/zafoot-apk-build"
rm -rf "$BUILD_DIR"

mkdir -p "$BUILD_DIR/src/com/zafoot/app"
mkdir -p "$BUILD_DIR/res/values"
mkdir -p "$BUILD_DIR/res/drawable"
mkdir -p "$BUILD_DIR/res/mipmap-mdpi"
mkdir -p "$BUILD_DIR/res/mipmap-hdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xhdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xxhdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xxxhdpi"
mkdir -p "$BUILD_DIR/bin"
mkdir -p "$BUILD_DIR/gen"

# 1. AndroidManifest.xml
cat << 'EOF' > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.zafoot.app"
    android:versionCode="2"
    android:versionName="1.1.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true"
        android:allowBackup="true"
        android:supportsRtl="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden|screenLayout"
            android:windowSoftInputMode="adjustResize"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# 2. strings.xml
cat << 'EOF' > "$BUILD_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">ZaFoot</string>
</resources>
EOF

# 3. Create high-resolution icons from real logo asset
LOGO_SRC="public/assets/aistudio/360_F_332687153_gmsohq86koOEWFYlYSI3N6xzb1zIcG88_cb9e53eb.jpg"
if [ -f "$LOGO_SRC" ]; then
    echo "Generating multi-density launcher icons from ZaFoot logo..."
    convert "$LOGO_SRC" -resize 48x48 "$BUILD_DIR/res/mipmap-mdpi/ic_launcher.png"
    convert "$LOGO_SRC" -resize 72x72 "$BUILD_DIR/res/mipmap-hdpi/ic_launcher.png"
    convert "$LOGO_SRC" -resize 96x96 "$BUILD_DIR/res/mipmap-xhdpi/ic_launcher.png"
    convert "$LOGO_SRC" -resize 144x144 "$BUILD_DIR/res/mipmap-xxhdpi/ic_launcher.png"
    convert "$LOGO_SRC" -resize 192x192 "$BUILD_DIR/res/mipmap-xxxhdpi/ic_launcher.png"
    cp "$BUILD_DIR/res/mipmap-xhdpi/ic_launcher.png" "$BUILD_DIR/res/drawable/ic_launcher.png"
fi

# 4. MainActivity.java - High performance WebView App with custom error screen and smooth web client
cat << 'EOF' > "$BUILD_DIR/src/com/zafoot/app/MainActivity.java"
package com.zafoot.app;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

public class MainActivity extends Activity {
    private WebView webView;
    private ProgressBar progressBar;
    private LinearLayout errorLayout;
    private static final String TARGET_URL = "https://ais-pre-o5hwgow52bmtj4nky4lgpk-173335827375.europe-west3.run.app";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Dark stadium theme header
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                             WindowManager.LayoutParams.FLAG_FULLSCREEN);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.parseColor("#070d14"));
            getWindow().setNavigationBarColor(Color.parseColor("#050b14"));
        }

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#050b14"));

        // Setup WebView
        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#050b14"));
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        // Setup Horizontal Loading Bar
        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setProgress(0);
        progressBar.setVisibility(View.GONE);
        FrameLayout.LayoutParams pbParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 8);
        root.addView(progressBar, pbParams);

        // Setup Offline / Error View
        errorLayout = new LinearLayout(this);
        errorLayout.setOrientation(LinearLayout.VERTICAL);
        errorLayout.setGravity(android.view.Gravity.CENTER);
        errorLayout.setBackgroundColor(Color.parseColor("#070d14"));
        errorLayout.setPadding(48, 48, 48, 48);
        errorLayout.setVisibility(View.GONE);

        TextView errTitle = new TextView(this);
        errTitle.setText("⚽ ZaFoot Quiz Arena");
        errTitle.setTextSize(22);
        errTitle.setTextColor(Color.WHITE);
        errTitle.setGravity(android.view.Gravity.CENTER);
        errorLayout.addView(errTitle);

        TextView errMsg = new TextView(this);
        errMsg.setText("\nUnable to load the game arena. Please check your internet connection and try again.");
        errMsg.setTextSize(14);
        errMsg.setTextColor(Color.parseColor("#94a3b8"));
        errMsg.setGravity(android.view.Gravity.CENTER);
        errorLayout.addView(errMsg);

        Button retryBtn = new Button(this);
        retryBtn.setText("Retry Connection");
        retryBtn.setBackgroundColor(Color.parseColor("#10b981"));
        retryBtn.setTextColor(Color.parseColor("#022c22"));
        LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        btnParams.topMargin = 48;
        errorLayout.addView(retryBtn, btnParams);

        retryBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                errorLayout.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
                webView.loadUrl(TARGET_URL);
            }
        });

        root.addView(errorLayout, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        setContentView(root);

        // Configure Settings
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // User Agent suffix
        String defaultUA = settings.getUserAgentString();
        settings.setUserAgentString(defaultUA + " ZaFootAndroidApp/1.1");

        // Enable cookies
        CookieManager.getInstance().setAcceptCookie(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
        }

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                showErrorScreen();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && request.isForMainFrame()) {
                    showErrorScreen();
                }
            }
        });

        loadGame();
    }

    private void loadGame() {
        if (!isNetworkConnected()) {
            showErrorScreen();
            return;
        }
        errorLayout.setVisibility(View.GONE);
        webView.setVisibility(View.VISIBLE);
        webView.loadUrl(TARGET_URL);
    }

    private void showErrorScreen() {
        webView.setVisibility(View.GONE);
        errorLayout.setVisibility(View.VISIBLE);
    }

    private boolean isNetworkConnected() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo activeNet = cm.getActiveNetworkInfo();
            return activeNet != null && activeNet.isConnectedOrConnecting();
        }
        return true;
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK) && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
EOF

# 5. Compile Android resources with aapt
echo "Packaging resources with aapt..."
aapt package -f -m \
    -J "$BUILD_DIR/gen" \
    -M "$BUILD_DIR/AndroidManifest.xml" \
    -S "$BUILD_DIR/res" \
    -I /usr/lib/android-sdk/platforms/android-23/android.jar

# 6. Compile Java source to class files with javac
echo "Compiling Java sources..."
javac -source 1.8 -target 1.8 \
    -cp /usr/lib/android-sdk/platforms/android-23/android.jar \
    -d "$BUILD_DIR/bin" \
    "$BUILD_DIR/gen/com/zafoot/app/R.java" \
    "$BUILD_DIR/src/com/zafoot/app/MainActivity.java"

# 7. Convert classes to Dalvik executable (classes.dex)
echo "Converting classes to classes.dex with dalvik-exchange..."
/usr/bin/dalvik-exchange --dex --output="$BUILD_DIR/bin/classes.dex" "$BUILD_DIR/bin"

# 8. Package initial unsigned APK
echo "Packaging APK with aapt..."
aapt package -f \
    -M "$BUILD_DIR/AndroidManifest.xml" \
    -S "$BUILD_DIR/res" \
    -I /usr/lib/android-sdk/platforms/android-23/android.jar \
    -F "$BUILD_DIR/unsigned.apk"

# Add classes.dex to APK
cd "$BUILD_DIR/bin"
zip -u "$BUILD_DIR/unsigned.apk" classes.dex
cd -

# 9. Align APK with zipalign (4-byte boundary)
echo "Aligning APK with zipalign..."
zipalign -v -p 4 "$BUILD_DIR/unsigned.apk" "$BUILD_DIR/aligned.apk"

# 10. Persistent Release Keystore
KEYSTORE="./keystore/zafoot-release.keystore"
if [ ! -f "$KEYSTORE" ]; then
    echo "Creating persistent release keystore in ./keystore/..."
    keytool -genkeypair -v \
        -keystore "$KEYSTORE" \
        -alias zafoot \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass zafootpass123 \
        -keypass zafootpass123 \
        -dname "CN=ZaFoot Football Quiz, OU=Mobile Engineering, O=ZaFoot Apps, L=Madrid, ST=Madrid, C=ES"
fi

# 11. Sign the APK with apksigner (v1, v2, v3 schemes)
echo "Signing APK with apksigner (v1, v2, v3)..."
apksigner sign \
    --ks "$KEYSTORE" \
    --ks-key-alias zafoot \
    --ks-pass pass:zafootpass123 \
    --key-pass pass:zafootpass123 \
    --out "$BUILD_DIR/zafoot.apk" \
    "$BUILD_DIR/aligned.apk"

# 12. Verify APK signature
echo "Verifying signed APK..."
apksigner verify --verbose "$BUILD_DIR/zafoot.apk"

# 13. Copy final APK to public downloads
mkdir -p ./public/downloads
cp "$BUILD_DIR/zafoot.apk" ./public/downloads/zafoot.apk
cp "$BUILD_DIR/zafoot.apk" ./public/zafoot.apk

if [ -d "./dist" ]; then
    mkdir -p ./dist/downloads
    cp "$BUILD_DIR/zafoot.apk" ./dist/downloads/zafoot.apk
    cp "$BUILD_DIR/zafoot.apk" ./dist/zafoot.apk
fi

echo "=== APK Successfully Built and Deployed ==="
ls -lh ./public/downloads/zafoot.apk
