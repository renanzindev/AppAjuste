import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import ClosedServiceCard from '../../../Components/ClosedServiceCard';
import EmptyHistory from '../../../Components/EmptyHistory';
import OsServiceService from '../../../Services/OsServiceService';

export default function ClosedServicesPeriodView() {
  const currentDate = new Date();

  const [month, setMonth] = React.useState(currentDate.getMonth());
  const [year, setYear] = React.useState(currentDate.getFullYear());
  const [loading, setLoading] = React.useState(false);
  const [closedServices, setClosedServices] = React.useState([]);

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  const years = [];

  for (let index = 2020; index <= currentDate.getFullYear(); index += 1) {
    years.push(index);
  }

  const searchClosedByPeriod = async () => {
    setLoading(true);

    const data = {
      month,
      year,
    };

    const [ok, response] = await OsServiceService.getClosedByPeriod(data);
    setClosedServices(ok ? response : []);

    setLoading(false);
  };

  React.useEffect(() => {
    searchClosedByPeriod();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    containerScroll: {
      minHeight: '100%',
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
      fontWeight: 'bold',
      fontSize: 12,
      lineHeight: 25,
      marginTop: 20,
      marginBottom: 0,
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <Text style={styles.title}>SERVIÇOS FECHADOS POR PERÍODO</Text>
        <Divider />
        <Card>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={month}
              style={{ height: 50 }}
              mode="dropdown"
              onValueChange={setMonth}
            >
              {!month ? <Picker.Item key={0} label="MÊS" value={null} /> : null}
              {months.map((periodMonth) => (
                <Picker.Item
                  key={periodMonth.value}
                  label={periodMonth.label}
                  value={periodMonth.value}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={year}
              style={{ height: 50 }}
              mode="dropdown"
              onValueChange={setYear}
            >
              {!year ? <Picker.Item key={0} label="ANO" value={null} /> : null}
              {years.map((periodYear) => (
                <Picker.Item
                  key={periodYear}
                  label={periodYear.toString()}
                  value={periodYear}
                />
              ))}
            </Picker>
          </View>
          <Button
            type="solid"
            title="CONSULTAR"
            color="white"
            buttonStyle={styles.searchButton}
            disabled={!month || !year || loading}
            disabledStyle={styles.searchButtonDisabled}
            loading={loading}
            onPress={searchClosedByPeriod}
          />
        </Card>

        {!loading ? (
          <>
            {closedServices.length ? (
              <View>
                {closedServices.map((service) => (
                  <ClosedServiceCard service={service} key={service.id} />
                ))}
              </View>
            ) : (
              <EmptyHistory />
            )}
          </>
        ) : null}
      </ScrollView>
      <BottomTabNavigator />
    </SafeAreaView>
  );
}
