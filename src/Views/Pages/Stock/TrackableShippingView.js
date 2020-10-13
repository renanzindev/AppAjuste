import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';

export default function TrackableShippingView() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Text>ENVIO DE RASTREÁVEIS</Text>
        </View>
      </ScrollView>
      <BottomTabNavigator />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
