import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Avatar, Card, ListItem } from '@rneui/themed';
import Moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../Contexts/AuthContext';
import EmployeeService from '../../Services/EmployeeService';
import BottomTabNavigator from '../../Components/BottomTabNavigator';

export default function HomeView() {
  const { getUser } = React.useContext(AuthContext);
  const [user, setUser] = React.useState({});
  const [birthdays, setBirthdays] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(true);

  const bindHomeView = async () => {
    setRefreshing(true);

    const response = await EmployeeService.birthdays();
    setBirthdays(response);

    setRefreshing(false);
  };
  const HomeViewOnRefresh = React.useCallback(() => {
    bindHomeView();
  }, []);

  React.useEffect(() => {
    getUser().then((response) => {
      setUser(response);
    });
    bindHomeView();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {user.funcionario ? (
          <ImageBackground
            source={require('../../Assets/Img/bgProfile.jpg')}
            style={styles.profileBg}
          >
            <View>
              <Avatar
                rounded
                size={50}
                containerStyle={styles.profileAvatar}
                source={{
                  uri: `https://smart.valorizandoseucarro.com.br/${user.funcionario.url_foto}`,
                }}
              />
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.profileName}>{user.funcionario.nome}</Text>
              <Text style={styles.profileRole}>
                {user.funcionario.cargo_atual.length
                  ? user.funcionario.cargo_atual[0].nome
                  : ''}
              </Text>
            </View>
          </ImageBackground>
        ) : null}
      </View>
      <ScrollView
        contentContainerStyle={styles.containerScroll}
        refreshControl={
          <RefreshControl
            colors={['#8bc34a']}
            size="large"
            refreshing={refreshing}
            onRefresh={HomeViewOnRefresh}
          />
        }
      >
        {!refreshing ? (
          <Card>
            <Card.Title>ANIVERSARIANTES DO MÊS</Card.Title>
            <Card.Divider />
            <View>
              {birthdays.map((employee, i) => {
                return (
                  <ListItem key={i} bottomDivider>
                    <ListItem.Content>
                      <ListItem.Title style={styles.employeeName}>
                        {employee.nome}
                      </ListItem.Title>
                      <View style={{ flexDirection: 'row' }}>
                        <ListItem.Subtitle style={styles.employeeRole}>
                          {employee.cargo_atual.length
                            ? employee.cargo_atual[0].nome
                            : null}
                        </ListItem.Subtitle>
                        <ListItem.Subtitle style={styles.employeeDate}>
                          {Moment(employee.data_nascimento).format('DD/MM')}
                        </ListItem.Subtitle>
                      </View>
                    </ListItem.Content>
                  </ListItem>
                );
              })}
            </View>
          </Card>
        ) : null}
      </ScrollView>
      <BottomTabNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerScroll: {
    minHeight: '100%',
    backgroundColor: '#f9f9f9',
    minWidth: '100%',
  },
  profileBg: {
    width: '100%',
    resizeMode: 'cover',
    flexDirection: 'row',
  },
  profileName: {
    textTransform: 'uppercase',
    marginTop: 15,
    marginLeft: 15,
    color: 'white',
    fontSize: 18,
  },
  profileRole: {
    textTransform: 'uppercase',
    marginLeft: 15,
    marginBottom: 20,
    color: 'white',
    fontSize: 14,
  },
  profileAvatar: {
    marginTop: 15,
    marginBottom: 20,
    marginLeft: 15,
    resizeMode: 'contain',
  },
  employeeName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  employeeRole: {
    width: '80%',
    textAlign: 'left',
    fontSize: 12,
  },
  employeeDate: {
    width: '20%',
    textAlign: 'right',
    fontSize: 12,
  },
  loading: {
    marginTop: 80,
  },
});
