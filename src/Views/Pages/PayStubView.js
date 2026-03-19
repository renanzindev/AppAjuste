import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Text } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigator from '../../Components/BottomTabNavigator';
import PayStubService from '../../Services/PayStubService';

export default function PayStubView() {
  const currentDate = new Date();

  const [loading, setLoading] = React.useState(false);
  const [hasHolerite, setHasHolerite] = React.useState(false);
  const [periods, setPeriods] = React.useState([]);

  const [values, setValues] = React.useState([
    { total: 'R$ *******', desconto: 'R$ *******', liquido: 'R$ *******' },
  ]);
  const [monthYear, setMonthYear] = React.useState(
    `${currentDate.getFullYear()}/${currentDate.getMonth()}`
  );
  const [typeOfPaystub, setTypeOfPaystub] = React.useState([
    { key: 0, value: 'Folha Mensal' },
    { key: 1, value: '13 Salario' },
  ]);
  const [type, setType] = React.useState(0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    containerScroll: {
      minWidth: '100%',
      flexGrow: 1,
      backgroundColor: '#f9f9f9',
    },
    searchButton: {
      height: 50,
      backgroundColor: '#00bcd4',
    },
    searchButtonDisabled: {
      backgroundColor: '#ccf1f6',
    },
    label: {
      width: '100%',
      textAlign: 'right',
      fontWeight: 'bold',
      fontSize: 16,
    },
    pickerContainer: {
      width: '100%',
      marginBottom: 10,
      height: 50,
      borderWidth: 1,
      borderColor: '#CBD5DD',
      borderRadius: 2,
      backgroundColor: 'white',
    },
    title: {
      margin: 10,
      textAlign: 'center',
      textTransform: 'uppercase',
      fontFamily: 'Arial',
      fontSize: 18,
      fontWeight: 'bold',
    },
    subTitle: {
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 25,
      marginTop: 0,
      marginBottom: 20,
    },
    groupContainer: {
      /* flexDirection: 'row', */
    },
  });

  /* Methods */
  const downloadFilePdf = async () => {
    const [year, month] = await monthYear.split('/');
    setLoading(true);
    await PayStubService.getPDF(year, month, type);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const roundDecimal = (numero, casasDecimais) => {
    casasDecimais = typeof casasDecimais !== 'undefined' ? casasDecimais : 2;
    return +`${Math.floor(`${numero}e+${casasDecimais}`)}e-${casasDecimais}`;
  };

  const getPeriods = async () => {
    setLoading(true);
    const [ok, res] = await PayStubService.index(monthYear, type);
    if (res.payStub) {
      setHasHolerite(true);
      setValues([
        {
          total: `R$ ${
            res.payStub.total_vencimentos ? res.payStub.total_vencimentos : 0.0
          }`,
          desconto: `R$ ${
            res.payStub.total_descontos ? res.payStub.total_descontos : 0.0
          }`,
          liquido: `R$ ${roundDecimal(
            res.payStub.total_vencimentos
              ? res.payStub.total_vencimentos - res.payStub.total_descontos
              : 0.0
          )}`,
        },
      ]);
    } else {
      setHasHolerite(false);
      setValues([
        {
          total: 'R$ *******',
          desconto: 'R$ *******',
          liquido: 'R$ *******',
        },
      ]);
    }
    setPeriods(
      ok
        ? res.periods.map((value, key) => {
            value =
              value !== null ? value.substring(0, 7).replace('-', '/') : null;
            return { key, value };
          })
        : []
    );

    setLoading(false);
  };

  const getMonthYearSelected = async (value) => {
    setMonthYear(value);
  };
  const getTypeOfPaystub = async (value) => {
    setType(value);
  };

  React.useEffect(() => {
    getPeriods();
  }, [monthYear, type]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <Text style={styles.title}>DEMONSTRATIVO DE PAGAMENTO</Text>
        <Divider />
        <Card>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={monthYear}
              style={{ height: 50 }}
              mode="dropdown"
              onValueChange={getMonthYearSelected}
            >
              {periods.length === 0 ? (
                <Picker.Item key={0} label={monthYear} value={null} />
              ) : null}
              {periods.map((period) => (
                <Picker.Item
                  key={period.key}
                  label={period.value}
                  value={period.value}
                />
              ))}
            </Picker>
          </View>
          <Divider width={5} />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={type}
              style={{ height: 50 }}
              mode="dropdown"
              onValueChange={getTypeOfPaystub}
            >
              {typeOfPaystub.map((item) => (
                <Picker.Item
                  key={item.key}
                  label={item.value}
                  value={item.key}
                />
              ))}
            </Picker>
          </View>
        </Card>

        <Card>
          <View>
            <Text style={styles.subTitle}>Total Vencimento</Text>
            <Text style={styles.label}>{values[0].total}</Text>
            <Text style={styles.subTitle}>Total Desconto</Text>
            <Text style={styles.label}>{values[0].desconto}</Text>
            <Text style={styles.subTitle}>Liquido</Text>
            <Text style={styles.label}>{values[0].liquido}</Text>
          </View>
        </Card>
        <Card>
          <Button
            type="solid"
            title="DOWNLOAD"
            color="white"
            buttonStyle={styles.searchButton}
            disabled={!hasHolerite}
            disabledStyle={styles.searchButtonDisabled}
            loading={loading}
            onPress={downloadFilePdf}
          />
        </Card>
      </ScrollView>
      <BottomTabNavigator />
    </SafeAreaView>
  );
}
