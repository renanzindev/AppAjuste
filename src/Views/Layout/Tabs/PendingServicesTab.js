import React from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import ClosedServiceCard from '../../../Components/ClosedServiceCard';
import EmptyHistory from '../../../Components/EmptyHistory';
import { OsServiceContext } from '../../../Contexts/OsServiceContext';

export default function PendingServicesTab() {
  const { pendingServices, loading, GetDataOnRefresh } =
    React.useContext(OsServiceContext);

  const styles = StyleSheet.create({
    containerScroll: {
      minHeight: '100%',
      backgroundColor: '#f9f9f9',
    },
  });

  return (
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
      {!loading ? (
        <>
          {pendingServices.length ? (
            <View>
              {pendingServices.map((service) => (
                <ClosedServiceCard service={service} key={service.id} />
              ))}
            </View>
          ) : (
            <EmptyHistory />
          )}
        </>
      ) : null}
    </ScrollView>
  );
}
