import React from 'react';
import { View, KeyboardAvoidingView, StyleSheet, ActivityIndicator } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useCameraPermission,
} from 'react-native-vision-camera';
import { AuthContext } from '../Contexts/AuthContext';
import { Button } from '@rneui/themed';

export default function BarcodeScanner() {
  const {
    setBarcodeValue,
    setOnCamera,
    continuousItemScan,
    setContinuousItemScan,
  } = React.useContext(AuthContext);

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: [
      'qr',
      'ean-13',
      'ean-8',
      'code-128',
      'code-39',
      'pdf-417',
      'aztec',
      'data-matrix',
      'itf',
      'codabar',
    ],
    onCodeScanned: codes => {
      if (codes.length === 0) return;
      const value = codes[0].value ?? '';
      setBarcodeValue(value);
      if (!continuousItemScan) {
        setOnCamera(false);
      }
    },
  });

  const onCancelPress = () => {
    setOnCamera(false);
    setContinuousItemScan(false);
  };

  if (!hasPermission || !device) {
    return (
      <KeyboardAvoidingView style={styles.root}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00bcd4" />
        </View>
        <View style={styles.lowerSection}>
          <Button
            onPress={onCancelPress}
            title={'Cancelar'}
            buttonStyle={styles.cancelButton}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.root}>
      <View style={styles.upperSection}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          torch="on"
          codeScanner={codeScanner}
        />
        <BarcodeMask
          width={'90%'}
          height={180}
          showAnimatedLine={true}
          animatedLineColor="#ff0000"
          lineAnimationDuration={1000}
          outerMaskOpacity={0.8}
        />
      </View>
      <View style={styles.lowerSection}>
        <Button
          onPress={onCancelPress}
          title={'Cancelar'}
          buttonStyle={styles.cancelButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  upperSection: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowerSection: {
    position: 'relative',
    bottom: 0,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#00bcd4',
  },
  camera: {
    height: '100%',
  },
});
