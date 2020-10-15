import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import ClosedServiceCard from '../../../Components/ClosedServiceCard';
import EmptyServiceHistory from '../../../Components/EmptyServiceHistory';
import { OsServiceContext } from '../../../Contexts/OsServiceContext';

export default function PendingServicesTab() {
  const { pendingServices, loading, GetDataOnRefresh } = React.useContext(
    OsServiceContext
  );

  return (
    <ScrollView
      contentContainerStyle={{ minHeight: '100%' }}
      refreshControl={
        <RefreshControl
          colors={['#8bc34a']}
          size="large"
          refreshing={loading}
          onRefresh={GetDataOnRefresh}
        />
      }
    >
      {pendingServices.length ? (
        <View>
          {pendingServices.map((service, i) => (
            <ClosedServiceCard service={service} key={i} />
          ))}
        </View>
      ) : (
        <EmptyServiceHistory />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
