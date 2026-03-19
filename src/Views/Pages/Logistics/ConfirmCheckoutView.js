import React from 'react';
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
  Modal,
} from 'react-native';
import {
  Button,
  Card,
  Divider,
  Icon,
  Input,
  Text,
} from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import DeliveryPackageService from '../../../Services/DeliveryPackageService';
import DeliveryPackageInformation from '../../../Components/DeliveryPackageInformation';
import { AuthContext } from '../../../Contexts/AuthContext';

import BarcodeScanner from '../../../Components/BarcodeScanner';
import ScanSuccessFlashOverlay from '../../../Components/ScanSuccessFlashOverlay';

export default function ConfirmCheckoutView() {
  const [allItemsRead, setAllItemsRead] = React.useState(false);
  const {
    onCamera,
    setOnCamera,
    barcodeValue,
    setBarcodeValue,
    setScanForItemIndex,
    scanForItemIndex,
    setContinuousItemScan,
  } = React.useContext(AuthContext);
  const [barcodeContext, setBarcodeContext] = React.useState(() => '');
  const [deliveryPackageCode, setDeliveryPackageCode] = React.useState('');
  const [deliveryPackage, setDeliveryPackage] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loadingPackage, setLoadingPackage] = React.useState(false);
  const [confirmingCheckout, setConfirmingCheckout] = React.useState(false);

  const packageCreated = 1;

  const clearForm = () => {
    setLoadingPackage(false);
    setDeliveryPackage(null);
    setErrorMessage('');
    setConfirmingCheckout(false);
  };

  const SearchBarcodePackage = () => {
    setScanForItemIndex(null);
    setContinuousItemScan(false);
    setBarcodeContext('deliveryPackage');
    setOnCamera(true);
  };

  const ConfirmCheckout = async () => {
    setConfirmingCheckout(true);

    const data = {
      logistica_expedicao_id: deliveryPackage.id,
    };

    try {
      await DeliveryPackageService.confirmCheckout(data);
      Alert.alert('Sucesso', 'Retirada Registrada com sucesso!');
      clearForm();
      setDeliveryPackageCode('');
    } catch (error) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro duranto o registro, verifique os dados informados e tente novamente!'
      );
      setConfirmingCheckout(false);
    }
  };

  const searchPackage = async () => {
    if (deliveryPackageCode.length === 12) {
      Keyboard.dismiss();
      clearForm();
      setLoadingPackage(true);

      const data = {
        codigo: deliveryPackageCode,
      };

      const [ok, response] = await DeliveryPackageService.search(data);
      if (ok) {
        if (response.logistica_expedicao_status_id === packageCreated) {
          await setDeliveryPackage(response);
        } else {
          switch (response.logistica_expedicao_status_id) {
            case 3:
              setErrorMessage('LOTE JÁ EM TRÂNSITO!');
              break;
            case 4:
              setErrorMessage('LOTE JÁ ENTREGUE!');
              break;
            case 5:
              setErrorMessage('LOTE DEVOLVIDO!');
              break;
            default:
              setErrorMessage('STATUS INVÁLIDO!');
              break;
          }
        }
      } else {
        setErrorMessage(response);
      }
      setLoadingPackage(false);
    }
  };

  React.useEffect(() => {
    const searchBarcode = async () => {
      if (
        barcodeContext === 'deliveryPackage' &&
        scanForItemIndex == null &&
        barcodeValue
      ) {
        setBarcodeContext('');
        const code = JSON.parse(JSON.stringify(barcodeValue));
        await setDeliveryPackageCode(code);
        setBarcodeValue('');
      }
    };

    searchBarcode();
  }, [barcodeValue]);

  React.useEffect(() => {
    const autoSearch = async () => {
      searchPackage();
    };
    autoSearch();
  }, [deliveryPackageCode]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <Text style={styles.title}>RETIRADA DE LOTE</Text>
        <Divider />
        <Card containerStyle={styles.cardContainer}>
          <View style={styles.barcodeContainer}>
            <View style={styles.barcodeInputContainer}>
              <Input
                placeholder="Código do Lote"
                autoCapitalize="none"
                onChangeText={setDeliveryPackageCode}
                value={deliveryPackageCode}
                keyboardType="numeric"
                maxLength={12}
              />
            </View>
            <View style={styles.barcodeButtonContainer}>
              <Button
                type="solid"
                icon={
                  <Icon
                    name="barcode-scan"
                    type="material-community"
                    color="white"
                  />
                }
                buttonStyle={styles.barcodeButton}
                onPress={SearchBarcodePackage}
              />
            </View>
          </View>
          {errorMessage ? (
            <Text style={styles.textError}>{errorMessage}</Text>
          ) : null}
          <Button
            type="solid"
            title="CONSULTAR LOTE"
            color="white"
            buttonStyle={styles.searchPackageButton}
            disabled={deliveryPackageCode.length !== 12 || loadingPackage}
            disabledStyle={styles.searchPackageButtonDisabled}
            loading={loadingPackage}
            onPress={searchPackage}
          />
        </Card>
        {deliveryPackage ? (
          <>
            <Card containerStyle={styles.cardContainer}>
              <DeliveryPackageInformation
                deliveryPackage={deliveryPackage}
                onAllItemsReadChange={setAllItemsRead}
              />
              <Button
                type="solid"
                title="RETIRAR LOTE"
                color="white"
                buttonStyle={styles.confirmButton}
                disabled={
                  !deliveryPackageCode ||
                  !deliveryPackage ||
                  confirmingCheckout ||
                  !allItemsRead
                }
                disabledStyle={styles.confirmButtonDisabled}
                loading={confirmingCheckout}
                onPress={ConfirmCheckout}
              />
            </Card>
          </>
        ) : null}
      </ScrollView>
      <BottomTabNavigator />
      <Modal visible={onCamera}>
        <View style={{ flex: 1 }}>
          <BarcodeScanner />
          <ScanSuccessFlashOverlay />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 50,
  },
  containerScroll: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    minWidth: '100%',
  },
  barcodeContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  barcodeInputContainer: {
    width: '80%',
  },
  barcodeButtonContainer: {
    width: '20%',
  },
  barcodeButton: {
    borderRadius: 10,
    height: 50,
    backgroundColor: '#00bcd4',
  },
  searchPackageButton: {
    borderRadius: 10,
    height: 50,
    backgroundColor: '#00bcd4',
  },
  searchPackageButtonDisabled: {
    backgroundColor: '#ccf1f6',
  },
  confirmButton: {
    borderRadius: 10,
    marginTop: 10,
    height: 60,
    backgroundColor: '#8bc34a',
  },
  confirmButtonDisabled: {
    backgroundColor: '#e7f3da',
  },
  textError: {
    color: 'red',
    textTransform: 'uppercase',
  },
  title: {
    margin: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Arial',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContainer: {
    borderRadius: 16,
  },
});
