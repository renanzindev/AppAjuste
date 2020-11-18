import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import ClosedServiceCard from '../../../Components/ClosedServiceCard';
import EmptyHistory from '../../../Components/EmptyHistory';
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
          {pendingServices.map((service) => (
            <ClosedServiceCard service={service} key={service.id} />
          ))}
        </View>
      ) : (
        <EmptyHistory />
      )}
    </ScrollView>
  );
}
