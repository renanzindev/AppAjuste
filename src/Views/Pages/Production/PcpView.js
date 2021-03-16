import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
} from 'react-native';
import { Button, Card, Divider } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Moment from 'moment';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import EmptyHistory from '../../../Components/EmptyHistory';
import PcpService from '../../../Services/PcpService';

export default function PcpView() {
  const isFocused = useIsFocused();
  const [schedules, setSchedules] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigation();

  const getSchedules = async () => {
    setSchedules([]);
    setLoading(true);

    const [ok, response] = await PcpService.index();

    if (ok) setSchedules(response);

    setLoading(false);
  };

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
            {schedules.length ? (
              schedules.map((schedule) => (
                <Card key={schedule.id}>
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
