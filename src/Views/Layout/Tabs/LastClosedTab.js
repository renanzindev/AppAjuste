import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { OsServiceContext } from '../../../Contexts/OsServiceContext';
import ClosedServiceCard from '../../../Components/ClosedServiceCard';
import EmptyServiceHistory from '../../../Components/EmptyServiceHistory';

export default function LastClosedTab() {
  const {
    closedServices,
    reprovedServices,
    loading,
    GetDataOnRefresh,
  } = React.useContext(OsServiceContext);

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
      {closedServices.length || reprovedServices.length ? (
        <View>
          {closedServices.map((service, i) => (
            <ClosedServiceCard service={service} key={i} />
          ))}
          {reprovedServices.map((service, i) => (
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
  serviceTitle: {
    textAlign: 'left',
    fontSize: 18,
    marginBottom: 5,
    color: '#5d585c',
  },
  serviceSubtitle: {
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
});
