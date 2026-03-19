import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import {
  Divider,
  Input,
  Button,
  Card,
} from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import EmptyHistory from '../../../Components/EmptyHistory';
import ProductsService from '../../../Services/ProductsService';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerScroll: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
  },
  title2: {
    margin: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Arial',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5d585c',
  },
  barcodeContainer: {
    flexDirection: 'row',
  },
  codeInputContainer: {
    width: '70%',
  },
  amountInputContainer: {
    width: '30%',
  },
  barcodeButtonContainer: {
    width: '19%',
    marginTop: '1%',
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 20,
  },
  listItem: {
    width: '100%',
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeServiceButton: {
    backgroundColor: '#00bcd4',
    marginTop: 10
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#CBD5DD',
    borderRadius: 2,
    backgroundColor: 'white',
  },
})

export default function RequestProductsView() {
  const isFocused = useIsFocused();
  const [productCode, setProductCode] = React.useState('');
  const [productAmount, setProductAmount] = React.useState('');
  const [products, setProducts] = React.useState([]);
  const [stores, setStores] = React.useState([]);
  const [storeId, setStoreId] = React.useState('');
  const [productSelected, setProductSelected] = React.useState([]);
  const navigation = useNavigation();

  const getProducts = async () => {
    setProducts([]);
    setProductSelected([]);

    const [ok, response] = await ProductsService.index();

    if (ok) setProducts(response);
  }

  const clearForm = () => {
    setProductAmount('');
    setProductCode('');
  }

  const handleProductCodeChange = () => {
    if(productCode.length > 1) {
      let product = products.filter((product) => product.id == productCode);
      if(product.length && !productSelected.includes(product[0])) {
        productSelected.push(product[0]);
        handleProductAmountChange();
        clearForm();
      } else if(product.length && productSelected.includes(product[0])) {
        setProductSelected(productSelected.filter((product) => product.id != productCode));
        clearForm();
      }
    }
  };

  const handleProductAmountChange = () => {
    productSelected.forEach((value, index) => {
      if(value.id == productCode) {
        productSelected[index].quantidade_requisitada = productAmount;
      }
    });
  };

  const requestProducts = async () => {
    concessionaria_id = storeId;
    produtos_selecionados = productSelected.map((product) => ({
      id: product.id,
      quantidade: product.quantidade_requisitada,
    }));
    
    data = {
      "concessionaria_id": concessionaria_id,
      "produtos": produtos_selecionados
    };

    const [ok, response] = await ProductsService.requestProducts(data);
    if(ok) {
      clearForm();
      navigation.navigate('HomeView');
      Alert.alert('Sucesso', 'Requisição Realizada Com Sucesso.');
    } else {
      Alert.alert('Erro', 'Houve Um Erro, Tente Mais Tarde.');
    }
  }

  React.useEffect(() => {
    getProducts();
    if(global.user.concessionarias && global.user.concessionarias.length > 0) {
      setStores(global.user.concessionarias.map((store) => store.concessionaria));
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <Text style={styles.title2}>REQUISITAR MATERIAL</Text>
        <Divider />
        <View style={styles.pickerContainer}>
        <Picker
          selectedValue={storeId}
          style={{ height: 50 }}
          mode="dropdown"
          onValueChange={setStoreId}
        >
          {!storeId ? (
            <Picker.Item
              key={0}
              label="SELECIONE CONCESSIONARIA"
              value={null}
            />
          ) : null}
          {stores.length ? 
            stores.map((store) => (
              <Picker.Item 
                key={store.id}
                label={store.nome}
                value={store.id}
              />
            ))
          : (
            <Picker.Item 
              key={9999}
              label="VINCULAR CONCESSIONÁRIA AO PRODUTIVO!"
              value={null}
            />
          )}
        </Picker>
        </View>
        <Divider />
        <View style={styles.barcodeContainer}>
          <View style={styles.amountInputContainer}>
            <Input
              keyboardType="numeric"
              placeholder="Quant."
              onChangeText={setProductAmount}
              value={productAmount}
              maxLength={12}
              disabled={!storeId}
            />
          </View>
          <View style={styles.codeInputContainer}>
            <Input
              keyboardType="numeric"
              placeholder="Código do Produto"
              onChangeText={setProductCode}
              onChange={handleProductCodeChange()}
              value={productCode}
              maxLength={12}
              disabled={!productAmount}
            />
          </View>
        </View>
        <Divider />
        {productSelected.length ? 
        (
        <View>
          <Card>
            {productSelected.map((item) => 
              <View key={item.id}>
                <Text style={styles.listItem} key={item.id}>{item.nome.trim()} | {item.quantidade_requisitada}X</Text>
                <Divider />
              </View>
            )}
            <Button
              type="solid"
              title="REQUISITAR"
              color="white"
              buttonStyle={styles.closeServiceButton}
              onPress={() => {
                requestProducts()
              }}
            />
          </Card>
        </View>
        ) : (
            <EmptyHistory />
          )}
      </ScrollView>
      <BottomTabNavigator />
    </SafeAreaView>
  )
}