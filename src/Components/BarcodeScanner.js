import React from 'react';
import { View, KeyboardAvoidingView, StyleSheet } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { AuthContext } from '../Contexts/AuthContext';
import { Button } from '@rneui/themed';

export default function BarcodeScanner() {
  const { setBarcodeValue, setOnCamera } = React.useContext(AuthContext);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8', 'qr', 'code-128', 'code-39', 'data-matrix'],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        setBarcodeValue(codes[0].value ?? '');
        setOnCamera(false);
      }
    },
  });

  const onCancelPress = () => {
    setOnCamera(false);
  };

  if (!device || !hasPermission) return null;

  return (
    <KeyboardAvoidingView style={styles.root}>
      <View style={styles.upperSection}>
        <Camera
          style={styles.preview}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
          torch="on"
        />
        <View style={styles.scanOverlay} pointerEvents="none">
          <View style={styles.scanFrame} />
        </View>
      </View>
      <View style={styles.lowerSection}>
        <Button
          onPress={onCancelPress}
          title="Cancelar"
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
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '80%',
    height: 180,
    borderWidth: 2,
    borderColor: '#ff0000',
    borderRadius: 8,
    backgroundColor: 'transparent',
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
});
