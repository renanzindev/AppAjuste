import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Card, ListItem, Input, Button, Icon } from '@rneui/themed';
import dayjs from 'dayjs';
import { AuthContext } from '../Contexts/AuthContext';
import { itemRequiresScan } from '../Utils/expeditionScanRules';

export default function DeliveryPackageInformation({
  deliveryPackage,
  onAllItemsReadChange,
}) {
  const {
    setOnCamera,
    setScanForItemIndex,
    setContinuousItemScan,
    continuousItemScan,
    barcodeValue,
    setBarcodeValue,
    setScanSuccessFlashTrigger,
  } = React.useContext(AuthContext);

  const buildReadState = (items, expedicaoTipo) =>
    items.map((item) => !itemRequiresScan(expedicaoTipo, item));

  const buildInputsState = (items, expedicaoTipo) =>
    items.map((item) =>
      !itemRequiresScan(expedicaoTipo, item)
        ? (item?.codigo ?? '').toString().trim()
        : ''
    );

  const [readItems, setReadItems] = React.useState(() =>
    buildReadState(deliveryPackage?.detalhes || [], deliveryPackage?.expedicao_tipo)
  );
  const [itemInputs, setItemInputs] = React.useState(() =>
    buildInputsState(deliveryPackage?.detalhes || [], deliveryPackage?.expedicao_tipo)
  );

  const detalhes = deliveryPackage?.detalhes || [];

  useEffect(() => {
    const items = deliveryPackage?.detalhes || [];
    const expedicaoTipo = deliveryPackage?.expedicao_tipo;
    setReadItems(buildReadState(items, expedicaoTipo));
    setItemInputs(buildInputsState(items, expedicaoTipo));
  }, [deliveryPackage?.id, deliveryPackage?.detalhes?.length, deliveryPackage?.expedicao_tipo]);

  useEffect(() => {
    const allRead = readItems.length > 0 && readItems.every(Boolean);
    onAllItemsReadChange?.(allRead);
    if (allRead) {
      setOnCamera(false);
      setContinuousItemScan(false);
    }
  }, [readItems, readItems.length, onAllItemsReadChange]);

  useEffect(() => {
    if (!continuousItemScan || !barcodeValue || detalhes.length === 0) return;
    const code = (barcodeValue || '').toString().trim();
    if (!code) {
      setBarcodeValue('');
      return;
    }
    const index = detalhes.findIndex(
      (d) => (d?.codigo ?? '').toString().trim() === code
    );
    if (index === -1) {
      Alert.alert('Código inválido', 'Código não pertence à lista.', [{ text: 'OK' }]);
      setBarcodeValue('');
      return;
    }
    if (readItems[index]) {
      setBarcodeValue('');
      return;
    }
    if (!itemRequiresScan(deliveryPackage?.expedicao_tipo, detalhes[index])) {
      setBarcodeValue('');
      return;
    }
    setScanSuccessFlashTrigger(Date.now());
    handleItemCodeChange(index, code);
    setBarcodeValue('');
  }, [continuousItemScan, barcodeValue]);

  const handleItemCodeChange = (index, value) => {
    setItemInputs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    const expectedCode = (detalhes[index]?.codigo ?? '').toString().trim();
    if (value.trim() === expectedCode) {
      setReadItems((prev) => {
        const next = [...prev];
        next[index] = true;
        return next;
      });
    }
  };

  const isCodeDuplicate = (index) => {
    const value = (itemInputs[index] ?? '').toString().trim();
    if (!value) return false;
    return itemInputs.some((v, j) => j !== index && (v ?? '').toString().trim() === value);
  };

  return (
    <>
      <View style={styles.well}>
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
            {deliveryPackage.created_at
              ? dayjs(deliveryPackage.created_at).format('DD/MM/YY HH:mm')
              : '—'}
          </Text>
          <Text>
            <Text style={styles.bold}>CRIADO POR:</Text>{' '}
            {deliveryPackage.funcionario_registro?.nome ?? '—'}
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
      <Button
        type="solid"
        title="ESCANEAR ITENS"
        icon={
          <Icon
            name="barcode-scan"
            type="material-community"
            color="white"
            style={{ marginRight: 8 }}
          />
        }
        iconPosition="left"
        buttonStyle={styles.scanItemsButton}
        onPress={() => {
          setScanForItemIndex(null);
          setContinuousItemScan(true);
          setOnCamera(true);
        }}
        accessibilityLabel="Escanear itens do lote"
      />
      <Card.Title style={styles.cardTitle}>DADOS DOS ITENS</Card.Title>
      <View>
        {detalhes.map((item, i) => {
          const isRead = readItems[i];
          return (
            <ListItem
              key={i}
              bottomDivider
              containerStyle={isRead ? styles.itemRowRead : styles.itemRowUnread}
            >
              <ListItem.Content>
                <ListItem.Title style={styles.itemTitle}>
                  {item.quantidade}X {item.produto} {item.veiculo}
                </ListItem.Title>
                <View style={[styles.itemCodeRow, { flexDirection: 'row' }]}>
                  <ListItem.Subtitle style={styles.itemRole}>
                    {item.tipo} - {item.codigo}
                  </ListItem.Subtitle>
                </View>
                <View style={styles.itemInputContainer}>
                  <Input
                    placeholder="Código do item"
                    value={itemInputs[i]}
                    onChangeText={(value) => handleItemCodeChange(i, value)}
                    editable={!isRead}
                    inputStyle={isRead ? { color: '#2e7d32' } : undefined}
                    autoCapitalize="none"
                  />
                </View>
                {isCodeDuplicate(i) ? (
                  <Text style={styles.codeDuplicateWarning}>
                    Este código já foi usado em outro item.
                  </Text>
                ) : null}
              </ListItem.Content>
            </ListItem>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  well: {
    backgroundColor: '#f5f5f5',
    marginTop: 0,
    marginBottom: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 10,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 20,
  },
  bold: {
    fontWeight: 'bold',
    lineHeight: 25,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemRole: {
    width: '60%',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCodeRow: {
    marginBottom: 2,
  },
  mgTop20: {
    marginTop: 10,
  },
  itemRowRead: {
    backgroundColor: '#c8e6c9',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  itemRowUnread: {
    backgroundColor: 'transparent',
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  itemInputContainer: {
    fontSize: 12,
    marginTop: 0,
  },
  scanItemsButton: {
    borderRadius: 10,
    height: 50,
    backgroundColor: '#00bcd4',
    marginBottom: 6,
  },
  codeDuplicateWarning: {
    color: '#c62828',
    fontSize: 12,
    marginTop: 4,
  },
});
