package com.smartapp2

import android.app.Application
import android.content.Context
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader

/**
 * SoLoader com [OpenSourceMergedSoMapping] é obrigatório no RN 0.76+ (libs JNI mescladas em libreactnative).
 * O manifesto da app força com.facebook.soloader.enabled=true porque dependências (ex.: Google Data Transport)
 * injetam false e desativam o SoLoader — nesse caso o sistema tenta carregar libreact_featureflagsjni.so solta e falha.
 */
class MainApplication : Application(), ReactApplication {

    override fun attachBaseContext(base: Context) {
        super.attachBaseContext(base)
        // Inicializar SoLoader o mais cedo possível (antes de qualquer loadLibrary).
        // RN 0.76+: libs merged em libreactnative.so; OpenSourceMergedSoMapping é obrigatório.
        SoLoader.init(this, OpenSourceMergedSoMapping)
    }

    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override fun getPackages(): List<ReactPackage> =
                PackageList(this).packages.apply {
                    // Packages that cannot be autolinked yet can be added manually here
                }

            override fun getJSMainModuleName(): String = "index"

            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

            override val isHermesEnabled: Boolean? = BuildConfig.IS_HERMES_ENABLED
        }

    override fun onCreate() {
        super.onCreate()
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            DefaultNewArchitectureEntryPoint.load()
        }
    }
}
