#!/usr/bin/env bash
set -e

echo "=== Building Real Android APK for ZaFoot ==="
BUILD_DIR="/tmp/zafoot-apk-build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/src/com/zafoot/app"
mkdir -p "$BUILD_DIR/res/values"
mkdir -p "$BUILD_DIR/res/drawable"
mkdir -p "$BUILD_DIR/bin"
mkdir -p "$BUILD_DIR/gen"

# 1. AndroidManifest.xml
cat << 'EOF' > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.zafoot.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:label="@string/app_name"
        android:icon="@drawable/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
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

# 3. Create PNG launcher icon using standard python struct+zlib
python3 - << 'PYEOF'
import struct, zlib

width = 96
height = 96
raw_data = bytearray()
for y in range(height):
    raw_data.append(0)
    for x in range(width):
        dx = x - width / 2
        dy = y - height / 2
        dist = (dx*dx + dy*dy)**0.5
        if dist < width * 0.45:
            r, g, b = 16, 185, 129
            if dist < width * 0.22:
                r, g, b = 245, 158, 11
        else:
            r, g, b = 11, 19, 30
        raw_data.extend([r, g, b, 255])

png = bytearray(b'\x89PNG\r\n\x1a\n')
ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
png.extend(struct.pack('>I', len(ihdr)) + b'IHDR' + ihdr + struct.pack('>I', zlib.crc32(b'IHDR' + ihdr)))
compressed = zlib.compress(bytes(raw_data))
png.extend(struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', zlib.crc32(b'IDAT' + compressed)))
png.extend(struct.pack('>I', 0) + b'IEND' + struct.pack('>I', zlib.crc32(b'IEND')))

with open("/tmp/zafoot-apk-build/res/drawable/ic_launcher.png", 'wb') as f:
    f.write(png)
PYEOF

# 4. MainActivity.java - Fast modern WebView wrapper for ZaFoot
cat << 'EOF' > "$BUILD_DIR/src/com/zafoot/app/MainActivity.java"
package com.zafoot.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        webView.setWebChromeClient(new WebChromeClient());

        // Load ZaFoot Production / Preview URL
        String targetUrl = "https://ais-pre-o5hwgow52bmtj4nky4lgpk-173335827375.europe-west3.run.app";
        webView.loadUrl(targetUrl);
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

# 6. Compile Java source to class files
echo "Compiling Java sources..."
javac -source 1.8 -target 1.8 \
    -cp /usr/lib/android-sdk/platforms/android-23/android.jar \
    -d "$BUILD_DIR/bin" \
    "$BUILD_DIR/gen/com/zafoot/app/R.java" \
    "$BUILD_DIR/src/com/zafoot/app/MainActivity.java"

# 7. Convert classes to Dalvik executable (classes.dex)
echo "Converting to classes.dex with dalvik-exchange..."
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

# 9. Align APK with zipalign
echo "Aligning APK with zipalign..."
zipalign -v -p 4 "$BUILD_DIR/unsigned.apk" "$BUILD_DIR/aligned.apk"

# 10. Generate Release Keystore if needed
KEYSTORE="$BUILD_DIR/zafoot-release.keystore"
if [ ! -f "$KEYSTORE" ]; then
    keytool -genkeypair -v \
        -keystore "$KEYSTORE" \
        -alias zafoot \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass zafootpass123 \
        -keypass zafootpass123 \
        -dname "CN=ZaFoot, OU=Mobile, O=ZaFoot Apps, L=Madrid, ST=Madrid, C=ES"
fi

# 11. Sign the APK with apksigner (v1 & v2 signatures)
echo "Signing APK with apksigner..."
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
echo "APK successfully created at ./public/downloads/zafoot.apk!"
ls -lh ./public/downloads/zafoot.apk
