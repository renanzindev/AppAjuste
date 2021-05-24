import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Card } from 'react-native-elements';
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
  const [employees, setEmployees] = React.useState([]);
  const [employeeId, setEmployeeId] = React.useState(null);

  const clearForm = () => {
    setEmployeeId(null);
    setDeliveryPackage(null);
  };

  const getEmployees = async () => {
    const [ok, response] = await EmployeeService.actives();

    if (ok) {
      setEmployees(response);
      setEmployeeId(null);
    }
  };

  const confirmDelivery = async () => {
    setConfirmingDelivery(true);

    const data = {
      logistica_expedicao_id: deliveryPackage.id,
      funcionario_recebimento_id: employeeId,
    };

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
                      onValueChange={setEmployeeId}
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
