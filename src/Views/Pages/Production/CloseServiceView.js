import React from 'react';
import { View, StyleSheet, Alert, Keyboard, Modal } from 'react-native';
import { Button, Card, Icon, Input, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import OsServiceService from '../../../Services/OsServiceService';
import { AuthContext } from '../../../Contexts/AuthContext';
import BarcodeScanner from '../../../Components/BarcodeScanner';

export default function CloseServiceView() {
  const { getUser, onCamera, setOnCamera, barcodeValue, setBarcodeValue } = React.useContext(AuthContext);
  const [serviceCode, setServiceCode] = React.useState('');
  const [barcodeContext, setBarcodeContext] = React.useState(() => (''));
  const [osService, setOsService] = React.useState(null);
  const [productionWorkerId, setProductionWorkerId] = React.useState('');
  const [loadingService, setLoadingService] = React.useState(false);
  const [loadingProduct, setLoadingProduct] = React.useState(false);
  const [productCode, setProductCode] = React.useState('');
  const [extraProductCode, setExtraProductCode] = React.useState('');
  const [errorMessageService, setErrorMessageService] = React.useState('');
  const [errorMessageProduct, setErrorMessageProduct] = React.useState('');
  const [productsCofirmed, setProductsCofirmed] = React.useState(false);
  const [closingService, setClosingService] = React.useState(false);
  const [user, setUser] = React.useState(null);

  const route = useRoute();
  const filmSubgroups = [1, 5];

  const defineInitialProductionWorker = () => {
    setProductionWorkerId('');
    if (osService && user) {
      const productionWorkers = osService.produtivos.map(
        (productionWorker) => productionWorker.id
      );
      if (productionWorkers.includes(user.funcionario.id)) {
        setProductionWorkerId(user.funcionario.id.toString());
      }
    }
  };

  const clearForm = () => {
    setLoadingService(false);
    setLoadingProduct(false);
    setOsService(null);
    setProductionWorkerId('');
    setProductCode('');
    setExtraProductCode('');
    setErrorMessageService('');
    setErrorMessageProduct('');
    setProductsCofirmed(false);
    setClosingService(false);
  };

  const confirmProducts = () => {
    let confirm = true;
    osService.servico.produtos.forEach((product) => {
      if (!product.codigo) confirm = false;
    });

    setProductsCofirmed(confirm);
  };

  const searchOsService = async () => {
    console.log(serviceCode.length);
    if (serviceCode.length === 12) {
      Keyboard.dismiss();
      clearForm();
      setLoadingService(true);

      const data = {
        codigo_servico: serviceCode,
      };

      const [ok, response] = await OsServiceService.search(data);
      if (ok) {
        await setOsService(response);
        setOnCamera(false);
        defineInitialProductionWorker();
      } else {
        setErrorMessageService(response);
      }
      setLoadingService(false);
    }
  };

  const searchProduct = async () => {
    if (productCode.length === 12) {
      setLoadingProduct(true);
      setErrorMessageProduct('');

      const data = {
        os_servico_id: osService.id,
        codigo_produto: productCode,
      };

      const [ok, response] = await OsServiceService.searchProduct(data);
      if (ok) {
        let found = false;
        osService.servico.produtos.forEach((product) => {
          if (product.id === response.produto_id && !product.codigo) {
            product.codigo = response.codigo;
            found = true;
          }

          if (
            !found &&
            filmSubgroups.includes(osService.servico.subgrupo_servico_id) &&
            !extraProductCode
          ) {
            setExtraProductCode(response.codigo);
          }
          setProductCode('');
          confirmProducts();
        });
      } else {
        setErrorMessageProduct(response);
      }
      setLoadingProduct(false);
    }
  };

  const CloseService = async () => {
    setClosingService(true);

    const products = osService.servico.produtos.map(
      (product) => product.codigo
    );
    if (extraProductCode) products.push(extraProductCode);

    const data = {
      os_servico_id: osService.id,
      produtivo_id: productionWorkerId,
      produtos: products,
    };
    try {
      await OsServiceService.closeService(data);
      Alert.alert('Sucesso', 'Fechamento Registrado com sucesso!');
      clearForm();
      setServiceCode('');
    } catch (error) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro duranto o registro, verifique os dados informados e tente novamente!'
      );
      setClosingService(false);
    }
  };

  const SearchBarcodeService = () => {
    setBarcodeContext('service');
    setOnCamera(true);
  }

  const SearchBarcodeProduct = () => {
    setBarcodeContext('product');
    setOnCamera(true);
  }

  React.useEffect(() => {
    const searchBarcode = async () => {
      if(barcodeContext === 'service') {
        setBarcodeContext('');
        const code = JSON.parse(JSON.stringify(barcodeValue));
        await setServiceCode(code);
        setBarcodeValue('');
      }

      if(barcodeContext === 'product') {
        setBarcodeContext('');
        const code = JSON.parse(JSON.stringify(barcodeValue));
        await setProductCode(code);
        setBarcodeValue('');
      }
    };

    searchBarcode();
  }, [barcodeValue]);

  React.useEffect(() => {
    const initialLoad = async () => {
      const loggedUser = await getUser();
      await setUser(loggedUser);
      defineInitialProductionWorker();
    };
    initialLoad();
  }, [osService]);

  React.useEffect(() => {
    if (route.params?.pcpServiceCode) {
      clearForm();
      setServiceCode(route.params?.pcpServiceCode);
    }
  }, [route.params?.pcpServiceCode]);

  React.useEffect(() => {
    searchOsService();
  }, [serviceCode]);

  React.useEffect(() => {
    searchProduct();
  }, [productCode]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card>
          <View style={styles.barcodeContainer}>
            <View style={styles.barcodeInputContainer}>
              <Input
                placeholder="Código do Serviço"
                autoCapitalize="none"
                onChangeText={setServiceCode}
                value={serviceCode}
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
                onPress={SearchBarcodeService}
              />
            </View>
          </View>
          {errorMessageService ? (
            <Text style={styles.textError}>{errorMessageService}</Text>
          ) : null}
          <Button
            type="solid"
            title="CONSULTAR SERVIÇO"
            color="white"
            buttonStyle={styles.searchServiceButton}
            disabled={serviceCode.length !== 12 || loadingService}
            disabledStyle={styles.searchServiceButtonDisabled}
            loading={loadingService}
            onPress={searchOsService}
          />
        </Card>
        {osService ? (
          <Card>
            <View>
              <Card.Title style={styles.cardTitle}>DADOS DA OS</Card.Title>
              <View style={styles.well}>
                <Text style={styles.bold}>
                  {osService.os.concessionaria.nome} -{' '}
                  {osService.os.departamento.sigla}
                </Text>
                <Text>
                  <Text style={styles.bold}>PREVISÃO DE ENTREGA:</Text>{' '}
                  {Moment(osService.os.data_entrega).format('DD/MM/YY HH:mm')}
                </Text>
                <Text>
                  <Text style={styles.bold}>OS:</Text>{' '}
                  {osService.os.os_concessionaria}
                </Text>
                <Text>
                  <Text style={styles.bold}>DATA DA OS:</Text>{' '}
                  {Moment(osService.os.created_at).format('DD/MM/YY HH:mm')}
                </Text>
                <Text>
                  <Text style={styles.bold}>CLIENTE:</Text>{' '}
                  {osService.os.cliente ? osService.os.cliente.nome : null}
                </Text>
              </View>
            </View>

            {osService.os.cliente_carro ? (
              <View>
                <Card.Title style={styles.cardTitle}>
                  DADOS DO VEÍCULO
                </Card.Title>
                <View style={styles.well}>
                  <Text>
                    <Text style={styles.bold}>VEÍCULO:</Text>{' '}
                    {osService.os.cliente_carro.modelo.marca.nome}{' '}
                    {osService.os.cliente_carro.modelo.nome}{' '}
                    {osService.os.cliente_carro.submodelo
                      ? `${osService.os.cliente_carro.submodelo.nome} `
                      : null}
                    {osService.os.cliente_carro.cor.nome}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>CHASSI:</Text>{' '}
                    {osService.os.cliente_carro
                      ? osService.os.cliente_carro.chassi
                      : null}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>PLACA:</Text>{' '}
                    {osService.os.cliente_carro
                      ? osService.os.cliente_carro.placa
                      : null}
                  </Text>
                </View>
              </View>
            ) : null}

            <View>
              <Card.Title style={styles.cardTitle}>DADOS DO SERVIÇO</Card.Title>
              <View style={styles.well}>
                <Text>
                  <Text style={styles.bold}>SERVIÇO:</Text>{' '}
                  {osService.servico.nome}{' '}
                  {osService.tonalidade ? osService.tonalidade.nome : null}
                </Text>
                <Text style={styles.label}>PRODUTIVO:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={productionWorkerId}
                    style={{ height: 50 }}
                    mode="dropdown"
                    onValueChange={setProductionWorkerId}
                  >
                    {!productionWorkerId ? (
                      <Picker.Item
                        key={0}
                        label="SELECIONE O PRODUTIVO"
                        value={null}
                      />
                    ) : null}
                    {osService.produtivos.map((productionWorker, i) => (
                      <Picker.Item
                        key={i}
                        label={productionWorker.nome}
                        value={productionWorker.id}
                      />
                    ))}
                  </Picker>
                </View>
                {osService.servico?.produtos.length ? (
                  <View>
                    <Text style={styles.label}>PRODUTO(S):</Text>
                    <View style={styles.well}>
                      {osService.servico.produtos.map((product, i) => (
                        <Text
                          key={i}
                          style={
                            product.codigo
                              ? styles.textSuccess
                              : styles.textError
                          }
                        >
                          {product.nome}: {product.codigo}
                        </Text>
                      ))}
                      {filmSubgroups.includes(
                        osService.servico.subgrupo_servico_id
                      ) ? (
                        <Text style={styles.textInfo}>
                          BOBINA ADICIONAL(OPCIONAL): {extraProductCode}
                        </Text>
                      ) : null}
                    </View>
                    <View />
                    <View style={styles.barcodeContainer}>
                      <View style={styles.barcodeInputContainer}>
                        <Input
                          placeholder="Código do Produto"
                          autoCapitalize="none"
                          onChangeText={setProductCode}
                          value={productCode}
                          keyboardType="numeric"
                          maxLength={12}
                          inputContainerStyle={[
                            styles.pickerContainer,
                            { marginLeft: 0 },
                          ]}
                          containerStyle={{ paddingLeft: 5 }}
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
                          onPress={SearchBarcodeProduct}
                        />
                      </View>
                    </View>
                    {errorMessageProduct ? (
                      <Text style={styles.textError}>
                        {errorMessageProduct}
                      </Text>
                    ) : null}
                    <Button
                      type="solid"
                      title="CONSULTAR PRODUTO"
                      color="white"
                      buttonStyle={styles.searchServiceButton}
                      disabled={productCode.length !== 12 || loadingProduct}
                      disabledStyle={styles.searchServiceButtonDisabled}
                      loading={loadingProduct}
                      onPress={searchProduct}
                    />
                  </View>
                ) : null}
              </View>
            </View>
            {!productionWorkerId ? (
              <Text style={[styles.textError, styles.lineSpaced]}>
                Informe o produtivo do serviço!
              </Text>
            ) : null}
            {osService.servico.produtos.length && !productsCofirmed ? (
              <Text style={[styles.textError, styles.lineSpaced]}>
                Informe o(s) código(s) do(s) produto(s)!
              </Text>
            ) : null}
            <Button
              type="solid"
              title="FECHAR SERVIÇO"
              color="white"
              buttonStyle={styles.confirmButton}
              disabled={
                !productionWorkerId ||
                (osService.servico.produtos.length && !productsCofirmed) ||
                closingService
              }
              disabledStyle={styles.confirmButtonDisabled}
              loading={closingService}
              onPress={CloseService}
            />
          </Card>
        ) : null}
      </ScrollView>
      <BottomTabNavigator />
      <Modal visible={onCamera}><BarcodeScanner/></Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  barcodeContainer: {
    flexDirection: 'row',
  },
  barcodeInputContainer: {
    width: '80%',
  },
  barcodeButtonContainer: {
    width: '20%',
  },
  barcodeButton: {
    height: 50,
    backgroundColor: '#00bcd4',
  },
  searchServiceButton: {
    height: 50,
    backgroundColor: '#00bcd4',
  },
  searchServiceButtonDisabled: {
    backgroundColor: '#ccf1f6',
  },
  cardTitle: {
    textAlign: 'left',
    fontSize: 20,
  },
  cardContent: {
    textAlign: 'left',
    fontSize: 18,
  },
  well: {
    backgroundColor: '#f5f5f5',
    marginTop: 0,
    marginBottom: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  bold: {
    fontWeight: 'bold',
    lineHeight: 25,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 25,
    marginTop: 20,
    marginBottom: 0,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#CBD5DD',
    borderRadius: 2,
    backgroundColor: 'white',
  },
  textError: {
    color: 'red',
    textTransform: 'uppercase',
  },
  textSuccess: {
    color: '#8bc34a',
    textTransform: 'uppercase',
  },
  textInfo: {
    color: '#3B799A',
    textTransform: 'uppercase',
  },
  confirmButton: {
    marginTop: 10,
    height: 60,
    backgroundColor: '#8bc34a',
  },
  confirmButtonDisabled: {
    backgroundColor: '#e7f3da',
  },
  lineSpaced: {
    lineHeight: 25,
  },
});
