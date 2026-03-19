import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { Divider } from '@rneui/themed';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import EmptyHistory from '../../../Components/EmptyHistory';
import { Button, Card } from '@rneui/base';
import OsServiceService from '../../../Services/OsServiceService';

export default function CheckoutCarView({ route }) {
  const isFocused = useIsFocused();
  const [ordemServico, setOrdemServico] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [inputChassi, setInputChassi] = React.useState(null);
  const [inputObs, setInputObs] = React.useState(null);
  const [osId, setOsId] = React.useState(null);
  const params = route.params || {};

  const getOsByChassi = async () => {
    setLoading(true);
    data = {
      chassi: inputChassi
    }
    const [ok, response] = await OsServiceService.getOsByChassi(data);
    
    if (ok) {
     setOrdemServico(response);
     setOsId(response.os[0].id)
    }
    setInputObs(params.prefix);
    setLoading(false);
  };
  
  const salvarObsOs = async () => {
    setLoading(true);
    data = {
      observacao: inputObs,
      tipo: 4, // salvar apenas no historico 
      os_id: osId
    }
    const [ok, response] = await OsServiceService.salvarObsOs(data);
    
    if (ok) {
     setOrdemServico(response);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    
  }, [ordemServico]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    containerScroll: {
      flexGrow: 1,
      backgroundColor: '#f9f9f9',
      minWidth: '100%',
    },
    title: {
      margin: 10,
      textAlign: 'center',
      textTransform: 'uppercase',
      fontFamily: 'Arial',
      fontSize: 18,
      fontWeight: 'bold',
    },
    emptyImage: {
      marginTop: 100,
      alignItems: 'center',
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
    cardButtonBuscar: {
      backgroundColor: '#00bcd4',
      flex: 2, // Equivalente a 20%
    },
    cardButtonSalvar: {
      backgroundColor: '#00bcd4',
    },
    cardBuscar: {
       flexDirection: 'row', // Alinha os elementos lado a lado
       alignItems: 'center', // Centraliza verticalmente
       gap: 10, // Espaço entre os elementos (suporte a partir do React Native 0.71)
    },
    cardInputChassi: {
      flex: 7, // Equivalente a 70%
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
    },
    cardInputObs: {
      flex: 10, // Equivalente a 70%
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
      textAlignVertical: "top", // Alinha o texto ao topo da caixa
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.containerScroll}
        refreshControl={
          <RefreshControl
            colors={['#8bc34a']}
            size="large"
            refreshing={loading}
          />
        }
      >
        <Text style={styles.title}>{params.title}</Text>
        <Divider />
        {!loading ? (
          <>
            <View>
              <Card>
                <Card.Title>Informe os 8 ultimos digitos do CHASSI do Veículo</Card.Title>
                <View style={styles.cardBuscar}>
                  <TextInput placeholder='A4546569' text={inputChassi} style={styles.cardInputChassi} onChangeText={setInputChassi}/>
                  <Button
                    type='solid'
                    title="Buscar"
                    buttonStyle={styles.cardButtonBuscar}
                    onPress={getOsByChassi}
                  />
                </View>
              </Card>
              {ordemServico.id ? (
                <Card>
                  <Card.Title>
                    {ordemServico.modelo.nome} | {ordemServico.cor.nome} | {ordemServico.ano_modelo} | {ordemServico.chassi} 
                  </Card.Title>
                  <View style={styles.cardExibir}>
                    <TextInput
                      value={inputObs} 
                      style={styles.cardInputObs} 
                      onChangeText={setInputObs} 
                      multiline={true}
                      numberOfLines={20}
                    />
                    <Card.Divider />
                    <Button
                      type='solid'
                      title={params.buttonName}
                      buttonStyle={styles.cardButtonSalvar}
                      onPress={salvarObsOs}
                    />
                  </View>
                </Card>
              ) : <View style={styles.emptyImage}>
                    <EmptyHistory />
                  </View> }
            </View>
          </>
        ) : null}
      </ScrollView>
      <BottomTabNavigator />
    </SafeAreaView>
  );
}
