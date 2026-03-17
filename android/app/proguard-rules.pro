# Add project specific ProGuard rules here.
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ========== React Native & Hermes (evita crash em release após instalação) ==========
# Hermes Unicode (ClassNotFoundException: AndroidUnicodeUtils sem isso)
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# React Native bridge e módulos nativos
-keep class com.facebook.react.bridge.** { *; }
-keep class * implements com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * implements com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers class * { native <methods>; }

# Anotações DoNotStrip (usadas pelo RN/Hermes)
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.jni.annotations.DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * { @com.facebook.proguard.annotations.DoNotStrip *; }
-keep @com.facebook.jni.annotations.DoNotStrip class *
-keepclassmembers class * { @com.facebook.jni.annotations.DoNotStrip *; }

# SoLoader / bibliotecas nativas
-keep class com.facebook.soloader.** { *; }

# Feature flags (patch usa LocalAccessor; evitar que CxxAccessor/CxxInterop sejam carregados em release)
-keep class com.facebook.react.internal.featureflags.ReactNativeFeatureFlags { *; }
-keep class com.facebook.react.internal.featureflags.ReactNativeFeatureFlagsLocalAccessor { *; }
-keep class com.facebook.react.internal.featureflags.ReactNativeNewArchitectureFeatureFlagsDefaults { *; }

# ========== react-native-reanimated (evita crash em release) ==========
-keep class com.swmansion.rnscreens.** { *; }
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }

# ========== react-native-gesture-handler ==========
-keep class com.swmansion.gesturehandler.** { *; }

# ========== react-native-vision-camera (frame processors / JNI) ==========
-keep class com.mrousavy.camera.** { *; }

# ========== react-native-vector-icons ==========
-keep class com.oblador.vectoricons.** { *; }

# ========== Evitar remoção de classes usadas por reflexão/serialização ==========
-keepattributes Signature
-keepattributes *Annotation*

# ========== Regras específicas do projeto ==========
