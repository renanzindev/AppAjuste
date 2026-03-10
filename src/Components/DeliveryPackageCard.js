import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Card, Divider } from '@rneui/themed';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';

export default function DeliveryPackageCard({ deliveryPackage, showButton }) {
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    cardContent: {
      borderBottomWidth: 22,
      borderRadius: 8,
    },
    cardTitle: {
      textAlign: 'left',
      fontSize: 20,
      marginBottom: 5,
      color: '#5d585c',
    },
    serviceSubtitle: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 10,
      color: '#5d585c',
    },
    confirmButton: {
      height: 50,
      backgroundColor: '#00bcd4',
    },
    bold: {
      fontWeight: 'bold',
    },
    badge: {
      height: 22,
      marginTop: 3,
      marginLeft: 10,
      padding: 3,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 20,
      justifyContent: 'center',
      alignContent: 'center',
    },
    badgeText: {
      color: 'white',
      fontSize: 10,
    },
    badgeInfo: {
      backgroundColor: '#00bcd4',
    },
    badgeError: {
      backgroundColor: 'red',
    },
    badgeSuccess: {
      backgroundColor: '#8bc34a',
    },
    badgeWarning: {
      backgroundColor: '#ffca29',
    },
    cardInfo: {
      borderColor: '#b2eaf2',
      borderBottomColor: '#00bcd4',
    },
    cardError: {
      borderColor: '#ffcccc',
      borderBottomColor: 'red',
    },
    cardSuccess: {
      borderColor: '#dcedc8',
      borderBottomColor: '#8bc34a',
    },
    cardWarning: {
      borderColor: '#ffefbe',
      borderBottomColor: '#ffca29',
    },
    mgTop20: {
      marginTop: 20,
    },
  });

  return (
    <Card
      containerStyle={[
        styles.cardContent,
        deliveryPackage.status.id === 1 ? styles.cardInfo : null,
        deliveryPackage.status.id === 3 ? styles.cardWarning : null,
        deliveryPackage.status.id === 4 ? styles.cardSuccess : null,
        deliveryPackage.status.id === 5 ? styles.cardError : null,
      ]}
    >
      <View style={{ flexDirection: 'row' }}>
        <Card.Title style={styles.cardTitle}>
          {deliveryPackage.codigo}
        </Card.Title>

        <View
          style={[
            styles.badge,
            deliveryPackage.status.id === 3 ? styles.badgeWarning : null,
            deliveryPackage.status.id === 4 ? styles.badgeSuccess : null,
            deliveryPackage.status.id === 5 ? styles.badgeError : null,
          ]}
        >
          <Text style={styles.badgeText}>{deliveryPackage.status.nome}</Text>
        </View>
      </View>
      <Text style={styles.serviceSubtitle}>
        <Text style={styles.bold}>DESTINO:</Text>{' '}
        {deliveryPackage.concessionaria?.nome}
      </Text>
      <Divider style={{ marginBottom: 10 }} />
      <View>
        <Text>
          <Text style={styles.bold}>ORIGEM:</Text>{' '}
          {deliveryPackage.expedicao_tipo}
        </Text>
        <Text>
          <Text style={styles.bold}>QUANTIDADE DE ITENS:</Text>{' '}
          {deliveryPackage.quantidade}
        </Text>

        <Text style={styles.mgTop20}>
          <Text style={styles.bold}>CRIADO EM:</Text>{' '}
          {dayjs(deliveryPackage.created_at).format('DD/MM/YY HH:mm')}
        </Text>
        <Text>
          <Text style={styles.bold}>CRIADO POR:</Text>{' '}
          {deliveryPackage.funcionario_registro.nome}
        </Text>

        {deliveryPackage.funcionario_logistica ? (
          <Text>
            <Text style={styles.bold}>ENTREGUE POR:</Text>{' '}
            {deliveryPackage.funcionario_logistica.nome}
          </Text>
        ) : null}

        {deliveryPackage.funcionario_recebimento ? (
          <>
            <Text>
              <Text style={styles.bold}>RECEBIDO EM:</Text>{' '}
              {dayjs(deliveryPackage.data_finalizacao).format(
                'DD/MM/YY HH:mm'
              )}
            </Text>
            <Text>
              <Text style={styles.bold}>RECEBIDO POR:</Text>{' '}
              {deliveryPackage.funcionario_recebimento.nome}
            </Text>
          </>
        ) : null}
      </View>
      {showButton ? (
        <>
          <Divider style={{ marginBottom: 10 }} />
          {deliveryPackage.status.id < 4 ? (
            <Button
              type="solid"
              title="ENTREGAR"
              color="white"
              buttonStyle={styles.confirmButton}
              onPress={() => {
                navigation.navigate('ConfirmDeliveryView', {
                  deliveryPackage,
                });
              }}
            />
          ) : (
            <Button
              type="solid"
              title="DETALHES"
              color="white"
              buttonStyle={styles.confirmButton}
              onPress={() => {
                navigation.navigate('ConfirmDeliveryView', {
                  deliveryPackage,
                });
              }}
            />
          )}
        </>
      ) : null}
    </Card>
  );
}
