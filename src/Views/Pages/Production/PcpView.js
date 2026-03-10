import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
} from 'react-native';
import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  SearchBar,
} from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
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
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [availableDates, setAvailableDates] = React.useState([]);
  const [formattedDates, setFormattedDates] = React.useState([]);

  const navigation = useNavigation();

  const updateSearch = (searchValue) => {
    setSearch(searchValue);
  };

  const filterDate = (scheduleList) => {
    let results = [...scheduleList];
    if (availableDates.length && selectedDate !== null) {
      const date = availableDates[selectedDate];

      results = scheduleList.filter((schedule) => {
        const scheduleDate = dayjs(schedule.data_agendamento).format(
          'DD/MM/YYYY'
        );

        return date === scheduleDate;
      });
    }

    return results;
  };

  const filterSchedules = (scheduleList) => {
    let results = [...scheduleList];
    if (search) {
      results = scheduleList.filter((schedule) => {
        const keys = Object.keys(schedule);
        let founded = false;

        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== 'codigo' && schedule[keys[i]]) {
            const value = schedule[keys[i]].toString().toLowerCase();

            if (value.indexOf(search.toLowerCase()) !== -1) {
              founded = true;
            }
          }
        }

        return founded;
      });
    }

    return results;
  };

  const defineFilteredSchedules = () => {
    let filteredSchedules = [...pcpSchedules];

    filteredSchedules = filterDate(filteredSchedules);
    filteredSchedules = filterSchedules(filteredSchedules);

    setSchedules([
      ...new Map(filteredSchedules.map((item) => [item.codigo, item])).values(),
    ]);
  };

  const selectDate = (index) => {
    if (index === selectedDate) {
      index = null;
    }

    setSelectedDate(index);
  };

  const getAvailableDates = () => {
    let dates = [];
    let dates2 = [];

    if (pcpSchedules.length) {
      dates = [
        ...new Set(
          pcpSchedules.map((schedule) =>
            dayjs(schedule.data_agendamento).format('DD/MM/YYYY')
          )
        ),
      ];

      dates2 = [
        ...new Set(
          pcpSchedules.map((schedule) =>
            dayjs(schedule.data_agendamento).format('DD/MM')
          )
        ),
      ];
    }
    setAvailableDates(dates);
    setFormattedDates(dates2);
  };

  const getSchedules = async () => {
    setPcpSchedules([]);
    setLoading(true);

    const [ok, response] = await PcpService.index();

    if (ok) setPcpSchedules(response);
  };

  React.useEffect(() => {
    getAvailableDates();
    defineFilteredSchedules();
    setLoading(false);
  }, [pcpSchedules]);

  React.useEffect(() => {
    defineFilteredSchedules();
  }, [search, selectedDate]);

  React.useEffect(() => {
    setSearch(null);
    setSelectedDate(null);
    getSchedules();
  }, [isFocused]);

  const PcpViewOnRefresh = React.useCallback(() => {
    setSearch(null);
    setSelectedDate(null);
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
    scheduleSubtitleReturn: {
      fontWeight: 'bold',
      fontSize: 14,
      marginBottom: 10,
      color: '#3b799a',
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
    selectedDateButton: {
      backgroundColor: '#00bcd4',
    },
    selectedDateText: {
      color: '#ffffff',
    },
    dateContainer: {
      height: 50,
    },
    dateButtonContainer: {
      minWidth: 85,
    },
    badge: {
      height: 22,
      marginLeft: 10,
      fontSize: 18,
      padding: 3,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 20,
      justifyContent: 'center',
      alignContent: 'center',
    },
    badgeText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 10,
    },
    badgeInfo: {
      backgroundColor: '#335397',
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
            {pcpSchedules.length ? (
              <SearchBar
                placeholder="Pesquisar Agendamento"
                onChangeText={updateSearch}
                containerStyle={styles.searchBarContainer}
                inputContainerStyle={styles.searchBarInputContainer}
                inputStyle={styles.searchBarInput}
                value={search}
              />
            ) : null}
            {formattedDates.length ? (
              <ScrollView horizontal>
                <ButtonGroup
                  buttons={formattedDates}
                  onPress={selectDate}
                  selectedIndex={selectedDate}
                  buttonContainerStyle={styles.dateButtonContainer}
                  containerStyle={styles.dateContainer}
                  selectedButtonStyle={styles.selectedDateButton}
                  selectedTextStyle={styles.selectedDateText}
                />
              </ScrollView>
            ) : null}
            {schedules.length ? (
              schedules.map((schedule) => (
                <Card key={schedule.codigo}>
                  <Card.Title style={styles.scheduleTitle}>
                    {dayjs(schedule.data_agendamento).format(
                      'DD/MM/YYYY HH:mm'
                    )}
                    {`  `}
                    {schedule.tipo_id === 6 ? (
                      <View style={[styles.badge, styles.badgeInfo]}>
                        <Text style={styles.badgeText}>RETORNO</Text>
                      </View>
                    ) : null}
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
