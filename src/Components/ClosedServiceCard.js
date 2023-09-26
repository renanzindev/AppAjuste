import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Card, Divider, Icon } from '@rneui/themed';
import Moment from 'moment';

export default function ClosedServiceCard({ service }) {
  const styles = StyleSheet.create({
    serviceTitle: {
      textAlign: 'left',
      fontSize: 16,
      marginBottom: 5,
      color: '#5d585c',
    },
    serviceSubtitle: {
      fontWeight: 'bold',
      fontSize: 12,
      marginBottom: 10,
      color: '#5d585c',
    },
    bold: {
      fontWeight: 'bold',
    },
    lineSpaced: {
      fontSize: 12,
      lineHeight: 16,
      color: '#5d585c',
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
    badgeIcon: {
      paddingLeft: 6,
      paddingRight: 6,
    },
    badgeText: {
      color: 'white',
      fontSize: 10,
    },
    badgeInfo: {
      backgroundColor: '#00bcd4',
    },
    badgeInfoReturn: {
      backgroundColor: '#335397',
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
    serviceCard: {
      borderBottomWidth: 22,
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
  });

  return (
    <Card
      containerStyle={[
        styles.serviceCard,
        service.os_servico?.pcp_agendamento?.data_agendamento
          ? styles.cardInfo
          : styles.cardWarning,
        service.finalizado ? styles.cardSuccess : null,
        service.cancelado ? styles.cardError : null,
      ]}
    >
      {service.os_servico?.pcp_agendamento?.data_agendamento ? (
        <View style={{ flexDirection: 'row' }}>
          <Card.Title style={styles.serviceTitle}>
            {Moment(
              service.os_servico?.pcp_agendamento?.data_agendamento
            ).format('DD/MM/YYYY HH:mm')}
          </Card.Title>
          <View style={[styles.badge, styles.badgeInfo]}>
            <Text style={styles.badgeText}>PCP</Text>
          </View>
          {service.os.os_tipo_id === 6 ? (
            <View style={[styles.badge, styles.badgeInfoReturn]}>
              <Text style={styles.badgeText}>RETORNO</Text>
            </View>
          ) : null}
          {service.finalizado && !service.cancelado ? (
            <View style={[styles.badge, styles.badgeIcon, styles.badgeSuccess]}>
              <Icon color="white" size={10} name="done" />
            </View>
          ) : null}
          {service.cancelado ? (
            <View style={[styles.badge, styles.badgeIcon, styles.badgeError]}>
              <Icon color="white" size={10} name="clear" />
            </View>
          ) : null}
        </View>
      ) : (
        <View style={{ flexDirection: 'row' }}>
          <Card.Title style={styles.serviceTitle}>
            {Moment(service.created_at).format('DD/MM/YYYY HH:mm')}
          </Card.Title>
          <View style={[styles.badge, styles.badgeWarning]}>
            <Text style={styles.badgeText}>MANUAL</Text>
          </View>
          {service.finalizado && !service.cancelado ? (
            <View style={[styles.badge, styles.badgeIcon, styles.badgeSuccess]}>
              <Icon color="white" size={10} name="done" />
            </View>
          ) : null}
          {service.cancelado ? (
            <View style={[styles.badge, styles.badgeIcon, styles.badgeError]}>
              <Icon color="white" size={10} name="clear" />
            </View>
          ) : null}
        </View>
      )}
      <Text style={styles.serviceSubtitle}>
        #{service.os?.os_concessionaria} {service.os?.concessionaria.nome}
      </Text>
      <Divider style={{ marginBottom: 10 }} />
      <Text style={styles.lineSpaced}>
        <Text style={styles.bold}>SERVIÇO:</Text>{' '}
        {service.os_servico?.servico.nome}{' '}
        {service.os_servico?.tonalidade?.nome}
      </Text>
      <Text style={styles.lineSpaced}>
        <Text style={styles.bold}>VEÍCULO:</Text>{' '}
        {service.os?.cliente_carro?.modelo.marca.nome}{' '}
        {service.os?.cliente_carro?.modelo.nome}
      </Text>
      <Text style={styles.lineSpaced}>
        <Text style={styles.bold}>CHASSI:</Text>{' '}
        {service.os?.cliente_carro?.chassi}
      </Text>
      <Divider style={{ marginTop: 10, marginBottom: 20 }} />
      <Text style={styles.lineSpaced}>
        <Text style={styles.bold}>PRODUTIVO:</Text> {service.produtivo.nome}
      </Text>
      <Text style={styles.lineSpaced}>
        <Text style={styles.bold}>DATA SOLICITAÇÃO:</Text>{' '}
        {Moment(service.created_at).format('DD/MM/YYYY HH:mm')}
      </Text>
      {service.finalizado && !service.cancelado ? (
        <View>
          <Divider style={{ marginTop: 10, marginBottom: 20 }} />
          <Text style={styles.lineSpaced}>
            <Text style={styles.bold}>APROVAÇÃO:</Text>{' '}
            {service.usuario_finalizacao?.nome}
          </Text>
          <Text style={styles.lineSpaced}>
            <Text style={styles.bold}>DATA:</Text>{' '}
            {Moment(service.data_finalizacao).format('DD/MM/YYYY HH:mm')}
          </Text>
        </View>
      ) : null}
      {service.cancelado ? (
        <View>
          <Divider style={{ marginTop: 10, marginBottom: 20 }} />
          <Text style={styles.lineSpaced}>
            <Text style={styles.bold}>CANCELAMENTO:</Text>{' '}
            {service.usuario_cancelamento?.nome}
          </Text>
          <Text style={styles.lineSpaced}>
            <Text style={styles.bold}>DATA:</Text>{' '}
            {Moment(service.data_cancelamento).format('DD/MM/YYYY HH:mm')}
          </Text>
          <Text style={styles.lineSpaced}>
            <Text style={styles.bold}>MOTIVO:</Text>{' '}
            {service.motivo_cancelamento}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}
