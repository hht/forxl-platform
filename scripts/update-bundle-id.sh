#!/bin/bash

# 读取.env文件
if [ -f ".env" ]; then
    source .env
else
    echo "错误: .env 文件不存在"
    exit 1
fi

# 检查必要的环境变量
if [ -z "$ANDROID_PACKAGE" ] || [ -z "$IOS_BUNDLE_ID" ] || [ -z "$OLD_ANDROID_PACKAGE" ] || [ -z "$OLD_IOS_BUNDLE_ID" ]; then
    echo "错误: 必要的环境变量未设置"
    echo "请确保在.env文件中设置了以下变量："
    echo "ANDROID_PACKAGE, IOS_BUNDLE_ID, OLD_ANDROID_PACKAGE, OLD_IOS_BUNDLE_ID"
    exit 1
fi

echo "开始更新配置..."


# 更新 app.json 配置
echo "正在更新 app.json 配置..."
APP_JSON_PATH="../app.json"
if [ -f "$APP_JSON_PATH" ]; then
    # 更新 app name 和 displayName
    sed -i '' "s/\"name\": \"${OLD_APP_SCHEME}\"/\"name\": \"${APP_SCHEME}\"/" "$APP_JSON_PATH"
    sed -i '' "s/\"displayName\": \"${OLD_NAME}\"/\"displayName\": \"${NAME}\"/" "$APP_JSON_PATH"
    sed -i '' "s/\"slug\": \"${OLD_APP_SCHEME}\"/\"slug\": \"${APP_SCHEME}\"/" "$APP_JSON_PATH"
    
    # 更新 scheme
    sed -i '' "s/\"scheme\": \"${OLD_APP_SCHEME}\"/\"scheme\": \"${APP_SCHEME}\"/" "$APP_JSON_PATH"
    
    # 更新 iOS bundleIdentifier
    sed -i '' "s/\"bundleIdentifier\": \"${OLD_IOS_BUNDLE_ID}\"/\"bundleIdentifier\": \"${IOS_BUNDLE_ID}\"/" "$APP_JSON_PATH"
    
    # 更新 Android package
    sed -i '' "s/\"package\": \"${OLD_ANDROID_PACKAGE}\"/\"package\": \"${ANDROID_PACKAGE}\"/" "$APP_JSON_PATH"
    
    echo "已更新 app.json 的配置"
else
    echo "警告: app.json 文件不存在: $APP_JSON_PATH"
fi

# 更新 Android 配置
echo "正在更新 Android 配置..."

# 更新 settings.gradle
SETTINGS_PATH="../android/settings.gradle"
if [ -f "$SETTINGS_PATH" ]; then
    # 更新 rootProject.name
    sed -i '' "s/rootProject.name = '${OLD_APP_SCHEME}'/rootProject.name = '${APP_SCHEME}'/" "$SETTINGS_PATH"
    echo "已更新 settings.gradle 的项目名称"
fi

# 更新 AndroidManifest.xml 的 host 和 scheme
MANIFEST_PATH="../android/app/src/main/AndroidManifest.xml"
if [ -f "$MANIFEST_PATH" ]; then
    # 更新 www host
    sed -i '' "s/android:host=\"www.${OLD_HOST}\"/android:host=\"www.${HOST}\"/" "$MANIFEST_PATH"
    # 更新 host
    sed -i '' "s/android:host=\"${OLD_HOST}\"/android:host=\"${HOST}\"/" "$MANIFEST_PATH"
    # 更新 scheme
    sed -i '' "s/android:scheme=\"${OLD_APP_SCHEME}\"/android:scheme=\"${APP_SCHEME}\"/" "$MANIFEST_PATH"
    echo "已更新 AndroidManifest.xml 的深链接配置"
fi

# 更新 build.gradle
GRADLE_PATH="../android/app/build.gradle"
if [ -f "$GRADLE_PATH" ]; then
    # 更新 applicationId，确保更新所有实例
    sed -i '' "s/applicationId ['\"']${OLD_ANDROID_PACKAGE}['\"']/applicationId '${ANDROID_PACKAGE}'/g" "$GRADLE_PATH"
    
    # 更新 namespace
    sed -i '' "s/namespace ['\"']${OLD_ANDROID_PACKAGE}['\"']/namespace '${ANDROID_PACKAGE}'/g" "$GRADLE_PATH"
    
    echo "已更新 build.gradle 的命名空间和包名配置"
fi

# 创建新的包名目录
NEW_PACKAGE_PATH="../android/app/src/main/java/${ANDROID_PACKAGE//.//}"
OLD_PACKAGE_PATH="../android/app/src/main/java/${OLD_ANDROID_PACKAGE//.//}"

# 检查旧目录是否存在
if [ ! -d "$OLD_PACKAGE_PATH" ]; then
    echo "警告: 旧包名目录不存在: $OLD_PACKAGE_PATH"
    echo "创建新目录: $NEW_PACKAGE_PATH"
    mkdir -p "$NEW_PACKAGE_PATH"
else
    # 创建新目录
    mkdir -p "$NEW_PACKAGE_PATH"

    # 移动并更新 Kotlin 文件
    for file in MainActivity.kt MainApplication.kt; do
        if [ -f "$OLD_PACKAGE_PATH/$file" ]; then
            # 更新包名并移动文件
            sed "s/package ${OLD_ANDROID_PACKAGE}/package ${ANDROID_PACKAGE}/" "$OLD_PACKAGE_PATH/$file" > "$NEW_PACKAGE_PATH/$file"
            echo "已更新并移动 $file 到新位置"
        else
            echo "警告: 文件不存在: $OLD_PACKAGE_PATH/$file"
        fi
    done

    # 删除旧的包目录
    if [ -d "$OLD_PACKAGE_PATH" ]; then
        rm -rf "$OLD_PACKAGE_PATH"
        echo "已删除旧的包目录: $OLD_PACKAGE_PATH"
        
        # 清理空目录
        OLD_BASE_DIR=$(dirname "$OLD_PACKAGE_PATH")
        while [ "$OLD_BASE_DIR" != "../android/app/src/main/java" ]; do
            rmdir "$OLD_BASE_DIR" 2>/dev/null || break
            OLD_BASE_DIR=$(dirname "$OLD_BASE_DIR")
            echo "清理空目录: $OLD_BASE_DIR"
        done
    fi
fi

# 更新 strings.xml
echo "正在更新应用名称..."
STRINGS_PATH="../android/app/src/main/res/values/strings.xml"
if [ -f "$STRINGS_PATH" ]; then
    sed -i '' "s/<string name=\"app_name\">${OLD_NAME}<\/string>/<string name=\"app_name\">${NAME}<\/string>/" "$STRINGS_PATH"
    echo "已更新 strings.xml 的应用名称"
fi

# 更新 iOS 配置
echo "正在更新 iOS 配置..."
PBXPROJ_PATH="../ios/forxl.xcodeproj/project.pbxproj"
if [ -f "$PBXPROJ_PATH" ]; then
    # 更新 Debug 配置的 bundle identifier
    sed -i '' "s/PRODUCT_BUNDLE_IDENTIFIER = ${OLD_IOS_BUNDLE_ID};/PRODUCT_BUNDLE_IDENTIFIER = ${IOS_BUNDLE_ID};/g" "$PBXPROJ_PATH"
    
    # 更新 INFOPLIST_KEY_CFBundleDisplayName
    sed -i '' "s/INFOPLIST_KEY_CFBundleDisplayName = \"${OLD_NAME}\";/INFOPLIST_KEY_CFBundleDisplayName = \"${NAME}\";/g" "$PBXPROJ_PATH"
    
    # 更新 productName
    sed -i '' "s/productName = forxl;/productName = zunkets;/g" "$PBXPROJ_PATH"
    
    echo "已更新 iOS bundle identifier 和应用名称"
else
    echo "警告: iOS 项目文件不存在: $PBXPROJ_PATH"
fi

# 更新 iOS Info.plist 配置
echo "正在更新 iOS Info.plist..."
INFO_PLIST_PATH="../ios/forxl/Info.plist"
if [ -f "$INFO_PLIST_PATH" ]; then
    # 更新 Display Name
    plutil -replace CFBundleDisplayName -string "${NAME}" "$INFO_PLIST_PATH"
    
    # 更新 URL Schemes
    plutil -replace CFBundleURLTypes -json '[{"CFBundleURLSchemes":["'"${APP_SCHEME}"'"]}]' "$INFO_PLIST_PATH"
    
    echo "已更新 Info.plist 的显示名称和 URL Scheme"
else
    echo "警告: Info.plist 文件不存在: $INFO_PLIST_PATH"
fi

# 更新 iOS Associated Domains
echo "正在更新 iOS Associated Domains..."
ENTITLEMENTS_PATH="../ios/forxl/forxl.entitlements"
if [ -f "$ENTITLEMENTS_PATH" ]; then
    sed -i '' "s/applinks:${OLD_HOST}/applinks:${HOST}/g" "$ENTITLEMENTS_PATH"
    sed -i '' "s/applinks:www.${OLD_HOST}/applinks:www.${HOST}/g" "$ENTITLEMENTS_PATH"
    echo "已更新 iOS Associated Domains 配置"
fi

# 更新 constants.ts 配置
echo "正在更新 constants.ts..."
CONSTANTS_PATH="../lib/constants.ts"
if [ -f "$CONSTANTS_PATH" ]; then    
    # 使用完整的 URL 配置进行替换    
    sed -i '' "s#export const APP_URL = \".*\"#export const APP_URL = \"${APP_URL}\"#" "$CONSTANTS_PATH"    
    sed -i '' "s#export const BASE_URL = \".*\"#export const BASE_URL = \"${BASE_URL}\"#" "$CONSTANTS_PATH"    
    sed -i '' "s#export const WS_URL = \".*\"#export const WS_URL = \"${WS_URL}\"#" "$CONSTANTS_PATH"    
    sed -i '' "s#export const TAWK_TO = \".*\"#export const TAWK_TO = \"${TAWK_TO}\"#" "$CONSTANTS_PATH"        
    echo "已更新 constants.ts 的配置"
else    
    echo "警告: constants.ts 文件不存在: $CONSTANTS_PATH"
fi

echo "配置更新完成！"
