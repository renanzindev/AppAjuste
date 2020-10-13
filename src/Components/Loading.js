import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

export default function Loading({ show, size }) {
  const styles = StyleSheet.create({
    loading: {
      height: size,
      resizeMode: 'contain',
    },
  });

  if (show) {
    return <ActivityIndicator color="#8bc34a" style={styles.loading} />;
  }

  return null;
}
