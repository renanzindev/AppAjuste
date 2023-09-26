import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Card, Input } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import DeliveryPackageInformation from '../../../Components/DeliveryPackageInformation';
import DeliveryPackageService from '../../../Services/DeliveryPackageService';
import EmployeeService from '../../../Services/EmployeeService';

export default function ConfirmDeliveryView() {
  const navigation = useNavigation();
  const route = useRoute();

  const [deliveryPackage, setDeliveryPackage] = React.useState(null);
  const [confirmingDelivery, setConfirmingDelivery] = React.useState(false);
  const [receiverNameInformed, setReceiverNameInformed] =
    React.useState(false); /* recebedor informado? */
  const [nameReceiver, setNameReceiver] =
    React.useState(''); /* recebedor informado? */
  const [employees, setEmployees] = React.useState([]);
  const [employeeId, setEmployeeId] = React.useState(null);

  const clearForm = () => {
    setEmployeeId(null);
    setDeliveryPackage(null);
  };

  /* função que muda a posição de um elemento de um array */
  const changePosition = (arr, from, to) => {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    return arr;
  };

  const getEmployees = async () => {
    const [ok, response] = await EmployeeService.actives();

    response.forEach((element, index) => {
      const lastIndex = response.length - 1;

      if (element.nome.toUpperCase() === 'sem produtivo'.toUpperCase()) {
        /* de sem produtivo para outros */
        response[index].nome = 'OUTROS';
        /* mudando a posição de Outros de n para 0 */
        changePosition(response, index, lastIndex);
      }
    });
    if (ok) {
      setEmployees(response);
      setEmployeeId(null);
    }
  };

  /* setar Id do funcionário e verifica se nome do recebedor foi informado */
  const checkNameRecipient = (id) => {
    setEmployeeId(id);
    const lastIndex = employees.length - 1;
    if (id === employees[lastIndex].id) {
      setReceiverNameInformed(true);
    } else {
      setReceiverNameInformed(false);
      setNameReceiver('');
    }
  };

  const confirmDelivery = async () => {
    setConfirmingDelivery(true);

    const data = {
      logistica_expedicao_id: deliveryPackage.id,
      funcionario_recebimento_id: employeeId,
      nome_recebedor: receiverNameInformed ? nameReceiver : null,
    };

    if (receiverNameInformed && nameReceiver === '') {
      Alert.alert('Erro', 'Informe o nome do recebedor!');
      setConfirmingDelivery(false);
    } else {
      try {
        await DeliveryPackageService.confirmDelivery(data);
        Alert.alert('Sucesso', 'Entrega Registrada com sucesso!');
        clearForm();
        const refreshPendingDeliveries = true;
        navigation.navigate('PendingDeliveriesView', refreshPendingDeliveries);
      } catch (error) {
        Alert.alert(
          'Erro',
          'Ocorreu um erro duranto o registro, verifique os dados informados e tente novamente!'
        );
        setConfirmingDelivery(false);
      }
    }
  };

  React.useEffect(() => {
    setDeliveryPackage(route.params.deliveryPackage);
    getEmployees();
  }, []);

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
    nameReceiverContainer: {
      width: '99%',
    },
    barcodeButton: {
      height: 50,
      backgroundColor: '#00bcd4',
    },
    searchPackageButton: {
      height: 50,
      backgroundColor: '#00bcd4',
    },
    searchPackageButtonDisabled: {
      backgroundColor: '#ccf1f6',
    },
    confirmButton: {
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
    pickerContainer: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: '#CBD5DD',
      borderRadius: 2,
      backgroundColor: 'white',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {deliveryPackage ? (
          <>
            <Card>
              <DeliveryPackageInformation deliveryPackage={deliveryPackage} />
              {deliveryPackage.status.id < 4 ? (
                <>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={employeeId}
                      style={{ height: 50 }}
                      mode="dropdown"
                      onValueChange={checkNameRecipient}
                    >
                      {!employeeId ? (
                        <Picker.Item
                          key={0}
                          label="SELECIONE O PRODUTIVO"
                          value={null}
                        />
                      ) : null}
                      {employees.map((employee) => (
                        <Picker.Item
                          key={employee.id}
                          label={employee.nome}
                          value={employee.id}
                        />
                      ))}
                    </Picker>
                  </View>
                  {receiverNameInformed ? (
                    <View style={styles.nameReceiverContainer}>
                      <Input
                        placeholder="Nome do recebedor"
                        autoCapitalize="none"
                        maxLength={100}
                        onChangeText={setNameReceiver}
                        value={nameReceiver}
                      />
                    </View>
                  ) : null}

                  <Button
                    type="solid"
                    title="CONFIRMAR ENTREGA"
                    color="white"
                    buttonStyle={styles.confirmButton}
                    disabled={
                      !employeeId || !deliveryPackage || confirmingDelivery
                    }
                    disabledStyle={styles.confirmButtonDisabled}
                    loading={confirmingDelivery}
                    onPress={confirmDelivery}
                  />
                </>
              ) : null}
            </Card>
          </>
        ) : null}
      </ScrollView>
      <BottomTabNavigator />
    </SafeAreaView>
  );
}
