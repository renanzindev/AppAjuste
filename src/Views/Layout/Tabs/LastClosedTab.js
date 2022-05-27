import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { OsServiceContext } from '../../../Contexts/OsServiceContext';
import ClosedServiceCard from '../../../Components/ClosedServiceCard';
import EmptyHistory from '../../../Components/EmptyHistory';

export default function LastClosedTab() {
  const { closedServices, reprovedServices, loading, GetDataOnRefresh } =
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
          {closedServices.length || reprovedServices.length ? (
            <View>
              {closedServices.map((service) => (
                <ClosedServiceCard service={service} key={service.id} />
              ))}
              {reprovedServices.map((service) => (
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
