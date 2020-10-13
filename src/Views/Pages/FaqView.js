import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigator from '../../Components/BottomTabNavigator';

export default function FaqView() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card>
          <Card.Title style={styles.cardTitle}>
            FAQ - Uso do Aplicativo
          </Card.Title>
          <Card.Divider style={styles.cardDivider} />
          <View style={styles.cardContent}>
            <Text style={styles.cardContentText}>
              O aplicativo Car Soul SMART para fechamento de ordem ser serviços
              tem como intuito aprimorar a gestão de produção da empresa através
              do controle de estoque e de produção através da informação
              tempestiva da execução do serviços.
            </Text>
          </View>
        </Card>
      </ScrollView>
      <BottomTabNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardTitle: {
    alignSelf: 'flex-start',
    textTransform: 'uppercase',
    fontFamily: 'Arial',
  },
  cardDivider: {
    marginTop: 10,
  },
  cardContent: {
    marginTop: 15,
  },
  cardContentText: {
    fontFamily: 'Arial',
    textAlign: 'justify',
    lineHeight: 20,
  },
});
