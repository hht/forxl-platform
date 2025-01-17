# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:

# Expo
-keep class expo.modules.** { *; }

-keep class com.google.android.gms.** { *; }
-keep class com.facebook.** { *; }

-keep class org.tensorflow.lite.** { *; }
-keep class org.tensorflow.lite.support.** { *; }
-keep class org.tensorflow.lite.nnapi.** { *; }
-keep interface org.tensorflow.lite.nnapi.** { *; }

-keep class com.google.android.gms.tasks.** { *; }
-keep interface com.google.android.gms.tasks.** { *; }


-dontwarn com.google.android.gms.tasks.Tasks