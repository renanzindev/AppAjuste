# UPGRADE REPORT — Smart App

**Data:** Março 2026  
**Branch:** `upgrade/react-native-modernization`

---

## Resumo das Atualizações

### Versões Antes / Depois

| Componente | Antes | Depois |
|---|---|---|
| React Native | 0.72.4 | 0.77.1 |
| React | 18.2.0 | 18.3.1 |
| Android compileSdkVersion | 34 | 35 |
| Android targetSdkVersion | 34 | **35** |
| Android NDK | 23.1.7779620 | **27.1.12297006** |
| Android Gradle Plugin (AGP) | (sem versão fixada) | **8.7.3** |
| Gradle Wrapper | 8.0.1 | **8.10.2** |
| TypeScript | 4.8.4 | ~5.3.0 |
| @babel/core | ^7.20.0 | ^7.25.0 |

---

## Bibliotecas Substituídas

| Biblioteca Removida | Substituta | Motivo |
|---|---|---|
| `react-native-camera` | `react-native-vision-camera` ^4.6.4 | Depreciada, sem suporte ativo |
| `react-native-barcode-mask` | Componente nativo (`StyleSheet.absoluteFillObject`) | Depreciada, integrada à Vision Camera |
| `rn-fetch-blob` | `react-native-blob-util` ^0.21.1 | API idêntica, mantida ativamente |
| `moment` + `moment-locales-webpack-plugin` | `dayjs` ^1.11.13 | Bundle 97% menor, API compatível |
| `deprecated-react-native-prop-types` | Removida | Não necessária no RN 0.74+ |
| Flipper (`flipper:0.182.0`) | Removido | Removido do RN 0.74+ |

## Bibliotecas Atualizadas

| Biblioteca | Antes | Depois |
|---|---|---|
| `@react-navigation/native` | ^6.1.7 | ^7.1.33 |
| `@react-navigation/stack` | ^6.3.17 | ^7.2.0 |
| `@react-navigation/drawer` | ^6.6.3 | ^7.3.0 |
| `react-native-reanimated` | ^3.4.2 | ^3.16.6 |
| `react-native-gesture-handler` | ^2.12.1 | ^2.21.2 |
| `react-native-screens` | ^3.25.0 | ^4.4.0 |
| `react-native-safe-area-context` | ^4.7.2 | ^5.3.0 |
| `@react-native-async-storage/async-storage` | ^1.19.3 | ^2.1.0 |

---

## Configurações Android — Conformidade Google Play Store

### Suporte a 16KB Memory Pages (NDK 27+)

Para atender ao requisito do Play Store de suporte a dispositivos com páginas de memória de 16KB:

- `ndkVersion` atualizado para `27.1.12297006` (NDK r27)
- `reactNativeArchitectures` limitado a `arm64-v8a,x86_64` (arquiteturas 64-bit)
- `packaging.jniLibs.useLegacyPackaging = false` configurado em `android/app/build.gradle`

### Target Android 15 (API 35)

```groovy
// android/build.gradle
buildToolsVersion = "35.0.0"
compileSdkVersion = 35
targetSdkVersion  = 35
ndkVersion        = "27.1.12297006"
```

### Gradle

```properties
# android/gradle/wrapper/gradle-wrapper.properties
distributionUrl=https://services.gradle.org/distributions/gradle-8.10.2-all.zip
```

---

## Arquivos Modificados

### Android

| Arquivo | Mudança |
|---|---|
| `android/build.gradle` | SDK 35, NDK 27, AGP 8.7.3 |
| `android/app/build.gradle` | Removido Flipper, removido `missingDimensionStrategy`, adicionado `packaging`, `buildFeatures` |
| `android/gradle/wrapper/gradle-wrapper.properties` | Gradle 8.10.2 |
| `android/gradle.properties` | Removido FLIPPER_VERSION, arquiteturas 64-bit only |
| `android/settings.gradle` | Migrado para novo formato com `ReactSettingsExtension` (RN 0.74+) |
| `android/app/src/main/java/.../MainApplication.java` | Removida chamada Flipper |
| `android/app/src/main/java/.../MainActivity.java` | Simplificado para padrão RN 0.74+ |
| `android/app/src/debug/.../ReactNativeFlipper.java` | **Deletado** |
| `android/app/src/release/.../ReactNativeFlipper.java` | **Deletado** |

### JavaScript / React Native

| Arquivo | Mudança |
|---|---|
| `package.json` | Todas as dependências atualizadas, depreciadas removidas |
| `babel.config.js` | Migrado para `@react-native/babel-preset` |
| `src/App.js` | Adicionado `GestureHandlerRootView`, moment → dayjs |
| `src/Components/BarcodeScanner.js` | Reescrito para Vision Camera v4 com `useCameraPermission` |
| `src/Config/DownloadManager.js` | `rn-fetch-blob` → `react-native-blob-util` |
| `src/Components/DeliveryPackageCard.js` | moment → dayjs |
| `src/Components/DeliveryPackageInformation.js` | moment → dayjs |
| `src/Components/ClosedServiceCard.js` | moment → dayjs |
| `src/Views/Pages/HomeView.js` | moment → dayjs |
| `src/Views/Pages/Production/PcpView.js` | moment → dayjs |
| `src/Views/Pages/Production/CloseServiceView.js` | moment → dayjs |
| `src/Views/Pages/Production/MyStockView.js` | moment → dayjs |

---

## Versão Web Criada

Localização: `/web`

```
/web
  /public
    index.html          ← Ponto de entrada HTML
  /pages
    LoginPage.js        ← Login responsivo
    DashboardPage.js    ← Dashboard com aniversariantes
    WebApp.js           ← Shell principal com roteamento
  /components
    WebNav.js           ← Sidebar de navegação
  index.web.js          ← Entry point com AuthContext
  package.json          ← Dependências web
  webpack.config.js     ← Build com React Native Web
```

---

## Como Executar

### Mobile (Android)

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Executar no emulador
npx react-native run-android

# Build de release
cd android && ./gradlew assembleRelease
```

### Web

```bash
# Instalar dependências web
cd web
npm install

# Executar em desenvolvimento (porta 3000)
npm start

# Build de produção
npm run build
```

---

## Checklist de Conformidade Google Play Store

- [x] targetSdkVersion = 35 (Android 15)
- [x] compileSdkVersion = 35
- [x] NDK 27+ instalado (16KB page support)
- [x] Apenas arquiteturas 64-bit (arm64-v8a, x86_64)
- [x] `useLegacyPackaging = false` (alinhamento 16KB em .so files)
- [x] React Native 0.77.1 (última versão estável)
- [x] Flipper removido
- [x] Bibliotecas depreciadas substituídas

---

## Notas Importantes

1. **Vision Camera v4**: Requer permissão de câmera solicitada via `useCameraPermission()`. O componente `BarcodeScanner.js` já inclui essa lógica.

2. **react-native-vector-icons**: A versão 10.x ainda funciona, mas o mantenedor recomenda migrar para pacotes por família de ícones (ex: `@react-native-vector-icons/material-icons`). Essa migração pode ser feita em uma próxima sprint.

3. **DownloadManager.js**: A permissão `WRITE_EXTERNAL_STORAGE` foi depreciada no Android 10+. Em Android 13+ (API 33+), use `READ_MEDIA_IMAGES` ou `READ_MEDIA_VIDEO`. Recomendado ajustar em sprint futura.

4. **New Architecture**: O projeto mantém `newArchEnabled=false`. A migração para Nova Arquitetura pode ser feita gradualmente quando todas as bibliotecas de terceiros suportarem.
