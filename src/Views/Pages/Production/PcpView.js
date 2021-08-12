import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
} from 'react-native';
import { Button, Card, Divider, SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Moment from 'moment';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import EmptyHistory from '../../../Components/EmptyHistory';
import PcpService from '../../../Services/PcpService';

export default function PcpView() {
  const isFocused = useIsFocused();
  const [pcpSchedules, setPcpSchedules] = React.useState([]);
  const [schedules, setSchedules] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState(null);

  const navigation = useNavigation();

  const updateSearch = (searchValue) => {
    setSearch(searchValue);
  };

  const filterSchedules = (schedulesList, searchValue) => {
    const results = schedulesList.filter((schedule) => {
      const keys = Object.keys(schedule);
      let founded = false;

      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== 'codigo') {
          const value = schedule[keys[i]].toString().toLowerCase();

          if (value.indexOf(searchValue.toLowerCase()) !== -1) {
            founded = true;
          }
        }
      }

      return founded;
    });

    return results;
  };

  const searchSchedules = () => {
    let originalSchedules = [...pcpSchedules];

    if (search) {
      originalSchedules = filterSchedules(originalSchedules, search);
    }

    setSchedules(originalSchedules);
  };

  const getSchedules = async () => {
    setPcpSchedules([]);
    setLoading(true);

    const [ok, response] = await PcpService.index();

    if (ok) setPcpSchedules(response);

    setLoading(false);
  };

  React.useEffect(() => {
    searchSchedules();
  }, [pcpSchedules, search]);

  React.useEffect(() => {
    getSchedules();
  }, [isFocused]);

  const PcpViewOnRefresh = React.useCallback(() => {
    getSchedules();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    containerScroll: {
      minHeight: '100%',
      backgroundColor: '#f9f9f9',
    },
    scheduleTitle: {
      textAlign: 'left',
      fontSize: 18,
      marginBottom: 5,
      color: '#5d585c',
    },
    scheduleSubtitle: {
      fontWeight: 'bold',
      fontSize: 14,
      marginBottom: 10,
      color: '#5d585c',
    },
    bold: {
      fontWeight: 'bold',
    },
    lineSpaced: {
      lineHeight: 25,
      color: '#5d585c',
    },
    closeServiceButton: {
      backgroundColor: '#00bcd4',
    },
    title: {
      marginTop: 20,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#5d585c',
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
    contentView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      textAlignVertical: 'center',
      minHeight: '100%',
    },
    searchBarContainer: {
      width: '100%',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      backgroundColor: '#f9f9f9',
    },
    searchBarInputContainer: {
      borderBottomWidth: 1,
      borderBottomColor: '#d9d9d9',
      backgroundColor: '#f9f9f9',
    },
    searchBarInput: {
      borderWidth: 0,
      backgroundColor: '#f9f9f9',
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
            onRefresh={PcpViewOnRefresh}
          />
        }
      >
        <Text style={styles.title2}>AGENDAMENTOS PENDENTES</Text>
        <Divider />
        {!loading ? (
          <View style={!schedules.length ? styles.contentView : null}>
            <SearchBar
              placeholder="Pesquisar agendamento"
              onChangeText={updateSearch}
              containerStyle={styles.searchBarContainer}
              inputContainerStyle={styles.searchBarInputContainer}
              inputStyle={styles.searchBarInput}
              value={search}
            />
            {schedules.length ? (
              schedules.map((schedule) => (
                <Card key={schedule.codigo}>
                  <Card.Title style={styles.scheduleTitle}>
                    {Moment(schedule.data_agendamento).format(
                      'DD/MM/YYYY HH:mm'
                    )}
                  </Card.Title>
                  <Text style={styles.scheduleSubtitle}>
                    #{schedule.os_concessionaria} {schedule.concessionaria}
                  </Text>
                  <Divider style={{ marginBottom: 10 }} />
                  <Text style={styles.lineSpaced}>
                    <Text style={styles.bold}>SERVIÇO:</Text> {schedule.servico}
                  </Text>
                  <Text style={styles.lineSpaced}>
                    <Text style={styles.bold}>VEÍCULO:</Text> {schedule.veiculo}
                  </Text>
                  <Text style={styles.lineSpaced}>
                    <Text style={styles.bold}>CHASSI:</Text> {schedule.chassi}
                  </Text>
                  <Divider style={{ marginTop: 10, marginBottom: 20 }} />
                  <Button
                    type="solid"
                    title="FECHAR SERVIÇO"
                    color="white"
                    buttonStyle={styles.closeServiceButton}
                    onPress={() => {
                      navigation.navigate('CloseServiceView', {
                        pcpServiceCode: schedule.codigo,
                      });
                    }}
                  />
                </Card>
              ))
            ) : (
              <EmptyHistory />
            )}
          </View>
        ) : null}
      </ScrollView>
      <BottomTabNavigator />
    </SafeAreaView>
  );
}
