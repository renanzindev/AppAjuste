import React from 'react'
import { View, KeyboardAvoidingView } from 'react-native'
import BarcodeMask from 'react-native-barcode-mask';
import { RNCamera } from 'react-native-camera';
import { Button } from 'react-native-elements';
import { AuthContext } from '../Contexts/AuthContext';

export default function BarcodeScanner() {
  const { setBarcodeValue, setOnCamera } = React.useContext(AuthContext);

  const OnBarCodeRead = (scanResult) => {
    setBarcodeValue(scanResult.data ? scanResult.data: '');
    setOnCamera(false);
  }

  const OnGetItemPress = () => {
    setOnCamera(false);
  }

  return (
    <KeyboardAvoidingView style={styles.root}>
          <View style={styles.upperSection}>
            <RNCamera
                style={styles.preview}
                torchMode="on"
                onBarCodeRead={OnBarCodeRead}
              >
              <BarcodeMask
                width={'90%'}
                height={180}
                showAnimatedLine={true}
                animatedLineColor="#ff0000"
                lineAnimationDuration={1000}
                outerMaskOpacity={0.8}
              />
            </RNCamera>
          </View>
          <View style={styles.lowerSection}>
            <Button
                onPress={OnGetItemPress}
                title={"Cancelar"}
                buttonStyle={styles.cancelButton}
            >
            </Button>
          </View>
        </KeyboardAvoidingView>
  )
}

const styles = {
  root: {
      flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  upperSection: {
      flex: 1
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
};
