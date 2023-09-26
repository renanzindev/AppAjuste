import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card, ListItem } from '@rneui/themed';
import Moment from 'moment';

export default function DeliveryPackageInformation({ deliveryPackage }) {
  const styles = StyleSheet.create({
    well: {
      backgroundColor: '#f5f5f5',
      marginTop: 0,
      marginBottom: 30,
      padding: 10,
      borderWidth: 1,
      borderColor: '#e8e8e8',
    },
    cardTitle: {
      textAlign: 'left',
      fontSize: 20,
    },
    bold: {
      fontWeight: 'bold',
      lineHeight: 25,
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    itemRole: {
      width: '80%',
      textAlign: 'left',
      fontSize: 12,
    },
    mgTop20: {
      marginTop: 20,
    },
  });

  return (
    <>
      <View>
        <Card.Title style={styles.cardTitle}>DADOS DO LOTE</Card.Title>
        <View style={styles.well}>
          <Text>
            <Text style={styles.bold}>CÓDIGO:</Text> {deliveryPackage.codigo}
          </Text>
          <Text>
            <Text style={styles.bold}>ORIGEM:</Text>{' '}
            {deliveryPackage.expedicao_tipo}
          </Text>
          <Text>
            <Text style={styles.bold}>DESTINO:</Text>{' '}
            {deliveryPackage.concessionaria?.nome}
          </Text>
          <Text>
            <Text style={styles.bold}>STATUS:</Text>{' '}
            {deliveryPackage.status?.nome}
          </Text>
          <Text>
            <Text style={styles.bold}>QUANTIDADE DE ITENS:</Text>{' '}
            {deliveryPackage.quantidade}
          </Text>

          <Text style={styles.mgTop20}>
            <Text style={styles.bold}>CRIADO EM:</Text>{' '}
            {Moment(deliveryPackage.created_at).format('DD/MM/YY HH:mm')}
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
            <Text>
              <Text style={styles.bold}>RECEBIDO POR:</Text>{' '}
              {deliveryPackage.funcionario_recebimento.nome}
            </Text>
          ) : null}
        </View>
      </View>
      <Card.Title style={styles.cardTitle}>DADOS DOS ITENS</Card.Title>
      <View>
        {deliveryPackage.detalhes.map((item, i) => {
          return (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title style={styles.itemTitle}>
                  {item.quantidade}X {item.produto} {item.veiculo}
                </ListItem.Title>
                <View style={{ flexDirection: 'row' }}>
                  <ListItem.Subtitle style={styles.itemRole}>
                    {item.tipo} - {item.codigo}
                  </ListItem.Subtitle>
                </View>
              </ListItem.Content>
            </ListItem>
          );
        })}
      </View>
    </>
  );
}
