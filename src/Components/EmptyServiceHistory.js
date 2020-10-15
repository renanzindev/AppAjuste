import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function EmptyServiceHistory() {
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image source={require('../Assets/Img/empty.png')} />
        <Text style={styles.text}>NENHUM REGISTRO{'\n'}ENCONTRADO</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  containerImage: {},
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    color: '#acabab',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
