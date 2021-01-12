import React from 'react'
import { SafeAreaView } from 'react-native';
import { RefreshControl } from 'react-native';
import { View, StyleSheet, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import DeliveryPackageCard from '../../../Components/DeliveryPackageCard';
import EmptyHistory from '../../../Components/EmptyHistory';
import DeliveryPackageService from '../../../Services/DeliveryPackageService';

export default function LastDeliveriesView() {
  const [lastDeliveries, setLastDeliveries] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getPageData = async () => {
    setLoading(true);

    const [ok, response] = await DeliveryPackageService.lastDeliveries();

    if (ok) {
      setLastDeliveries(response);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    getPageData();
  }, []);

  const GetDataOnRefresh = React.useCallback(() => {
    getPageData();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      minHeight: '100%',
    },
    containerScroll: {
      minHeight: '100%',
      backgroundColor: '#fff',
      minWidth: '100%',
    },
    title: {
      margin: 10,
      textAlign:'center',
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
            onRefresh={GetDataOnRefresh}
          />
        }
      >
        <Text style={styles.title}>ÚLTIMOS LOTES ENTREGUES</Text>
        {lastDeliveries.length ? (
          <View>
            {lastDeliveries.map((deliveryPackage) => (
              <DeliveryPackageCard
                key={deliveryPackage.id}
                deliveryPackage={deliveryPackage}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyImage}>
            <EmptyHistory />
          </View>
        )}
      </ScrollView>
      <BottomTabNavigator />
    </SafeAreaView>
  );
}
