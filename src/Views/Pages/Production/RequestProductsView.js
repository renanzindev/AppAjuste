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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerScroll: {
    minHeight: '100%',
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
})

export default function RequestProductsView() {
  const isFocused = useIsFocused();
  const [productCode, setProductCode] = React.useState('');
  const [productAmount, setProductAmount] = React.useState('');
  const [products, setProducts] = React.useState([]);
  const [user, setUser] = React.useState({});
  const [productSelected, setProductSelected] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();
  const getProducts = async () => {
    setProducts([]);
    setLoading(true);

    const [ok, response] = await ProductsService.index();

    if (ok) setProducts(response);
  }
  const clearForm = () => {
    setProductAmount('');
    setProductCode('');
  }
  const handleProductCodeChange = () => {
    let product = products.filter((product) => product.id == productCode);
    if(product.length && !productSelected.includes(product[0])) {
      productSelected.push(product[0]);
      handleProductAmountChange();
      clearForm();
    } else if(product.length && productSelected.includes(product[0])) {
      setProductSelected(productSelected.filter((product) => product.id != productCode));
      clearForm();
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
    concessionaria_id = user.funcionario.cargo_atual.filter((cargo) => cargo.data_demissao == null)[0].pivot.concessionaria_local_id;
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
    setUser(global.user);
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <Text style={styles.title2}>REQUISITAR MATERIAL</Text>
        <Divider />
        <View style={styles.barcodeContainer}>
          <View style={styles.amountInputContainer}>
            <Input
              keyboardType="numeric"
              placeholder="Quant."
              onChangeText={setProductAmount}
              value={productAmount}
              maxLength={12}
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