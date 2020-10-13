import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ErrorMessage(props) {
  if (props.message) {
    return (
      <View style={styles.errorMessage}>
        <Text style={styles.errorMessageText}>{props.message}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  errorMessage: {
    width: '75%',
    backgroundColor: '#FBE9E6',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f7d0d1',
    borderRadius: 2,
    marginTop: 20,
  },
  errorMessageText: {
    fontSize: 10,
    color: '#A1513C',
  },
});
