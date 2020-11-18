import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import { Divider } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import EmptyHistory from '../../../Components/EmptyHistory';
import DeliveryPackageService from '../../../Services/DeliveryPackageService';
import DeliveryPackageCard from '../../../Components/DeliveryPackageCard';

export default function PendingDeliveriesView() {
  const [pendingDeliveries, setPendingDeliveries] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getPageData = async () => {
    setLoading(true);

    const [ok, response] = await DeliveryPackageService.pendingDeliveries();

    if (ok) {
      setPendingDeliveries(response);
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
    title: {
      margin: 10,
      alignSelf: 'flex-start',
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
    itemTitle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    itemRole: {
      width: '80%',
      textAlign: 'left',
      fontSize: 12,
    },
    mgTop20: {
      marginTop: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={['#8bc34a']}
            size="large"
            refreshing={loading}
            onRefresh={GetDataOnRefresh}
          />
        }
      >
        <Text style={styles.title}>LOTES EM TRÂNSITO</Text>
        <Divider />
        {pendingDeliveries.length ? (
          <View>
            {pendingDeliveries.map((deliveryPackage) => (
              <DeliveryPackageCard
                key={deliveryPackage.id}
                deliveryPackage={deliveryPackage}
                showButton
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
