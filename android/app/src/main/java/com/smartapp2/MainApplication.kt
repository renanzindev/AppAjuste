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
 * IMPORTANTE: Para evitar crash "libreact_featureflagsjni.so not found" com newArchEnabled=false,
 * o patch em patches/react-native+0.77.1.patch é obrigatório. Ele faz o RN usar LocalAccessor
 * em vez de CxxAccessor, evitando carregar a .so. Após "npm install" o postinstall aplica os patches.
 * Se o erro voltar: rode "npm run postinstall" e depois "npm run android:clean-run".
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
