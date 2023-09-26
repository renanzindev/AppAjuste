import React from 'react';
import { StyleSheet, RefreshControl, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Divider, Icon, Overlay } from '@rneui/themed';
import { Dialog, SearchBar } from '@rneui/themed';
import WarehouseOrderService from '../../../Services/WarehouseOrderService';
import EmptyHistory from '../../../Components/EmptyHistory';
import { useNavigation } from '@react-navigation/native';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';

export default function MyStockView() {
  const [itemsOriginal, setItemsOriginal] = React.useState('');
  const [items, setItems] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showReturnDialog, setShowReturnDialog] = React.useState(false);
  const [search, setSearch] = React.useState(null);
  // const [returnedItem, setReturnedItem] = React.useState(null);

  const navigation = useNavigation();

  const updateSearch = (searchValue) => {
    setSearch(searchValue);
  };

  const loadMyStock = async () => {
    setItemsOriginal([]);
    setLoading(true);

    const [ok, response] = await WarehouseOrderService.myItems();

    if (ok) setItemsOriginal(response);
  };

  const returnItem = () => {
    setShowReturnDialog(!showReturnDialog);
  };

  const defineFilteredItems = () => {
    let filteredItems = [...itemsOriginal];

    filteredItems = filterItems(filteredItems);

    setItems([
      ...new Map(filteredItems.map((item) => [item.codigo, item])).values(),
    ]);
  };

  const filterItems = (itemsList) => {
    let results = [...itemsList];
    if (search) {
      results = itemsList.filter((schedule) => {
        const keys = Object.keys(schedule);
        let founded = false;

        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== 'codigo' && schedule[keys[i]]) {
            const value = schedule[keys[i]].toString().toLowerCase();

            if (value.indexOf(search.toLowerCase()) !== -1) {
              founded = true;
            }
          }
        }

        return founded;
      });
    }

    return results;
  };

  React.useEffect(() => {
    defineFilteredItems();
  }, [itemsOriginal, search]);

  React.useEffect(() => {
    setLoading(false);
  }, [itemsOriginal]);

  React.useEffect(() => {
    loadMyStock();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    searchBarContainer: {
      width: '100%',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      backgroundColor: '#f9f9f9',
    },
    searchBarInputContainer: {
      borderBottomWidth: 1,
      borderBottomColor: '#d9d9d9',
      backgroundColor: '#f9f9f9',
    },
    searchBarInput: {
      borderWidth: 0,
      backgroundColor: '#f9f9f9',
    },
    containerScroll: {
      minHeight: '100%',
      backgroundColor: '#f9f9f9',
    },
    titleContainer: {
      flexDirection: 'row',
    },
    titleTextContainer: {
      width: '80%',
    },
    titleButtonContainer: {
      width: '20%',
    },
    barcodeButton: {
      height: 50,
      backgroundColor: '#00bcd4',
    },
    searchServiceButton: {
      height: 50,
      backgroundColor: '#00bcd4',
    },
    searchServiceButtonDisabled: {
      backgroundColor: '#ccf1f6',
    },
    cardTitle: {
      textAlign: 'left',
      fontSize: 20,
    },
    cardContent: {
      textAlign: 'left',
      fontSize: 18,
    },
    well: {
      backgroundColor: '#f5f5f5',
      marginTop: 0,
      marginBottom: 30,
      padding: 10,
      borderWidth: 1,
      borderColor: '#e8e8e8',
    },
    bold: {
      fontWeight: 'bold',
      lineHeight: 25,
    },
    label: {
      fontWeight: 'bold',
      fontSize: 12,
      lineHeight: 25,
      marginTop: 20,
      marginBottom: 0,
    },
    pickerContainer: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: '#CBD5DD',
      borderRadius: 2,
      backgroundColor: 'white',
    },
    textError: {
      color: 'red',
      textTransform: 'uppercase',
    },
    textSuccess: {
      color: '#8bc34a',
      textTransform: 'uppercase',
    },
    textInfo: {
      color: '#3B799A',
      textTransform: 'uppercase',
    },
    confirmButton: {
      marginTop: 10,
      height: 60,
      backgroundColor: '#8bc34a',
    },
    confirmButtonDisabled: {
      backgroundColor: '#e7f3da',
    },
    title: {
      margin: 10,
      textAlign: 'center',
      textTransform: 'uppercase',
      fontFamily: 'Arial',
      fontSize: 18,
      fontWeight: 'bold',
    },
    title2: {
      margin: 10,
      textAlign: 'center',
      textTransform: 'uppercase',
      fontFamily: 'Arial',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#5d585c',
    },
    itemTitle: {
      textAlign: 'left',
      fontSize: 18,
      marginBottom: 0,
      color: '#5d585c',
    },
    itemSubtitle: {
      fontWeight: 'bold',
      fontSize: 24,
      marginBottom: 0,
      marginTop: 0,
      color: '#5d585c',
    },
    itemButton: {
      backgroundColor: '#00bcd4',
    },
    returnButton: {
      width: 35,
      backgroundColor: '#00bcd4',
      borderRadius: 50,
      alignSelf: 'flex-end',
      display: 'none'
    },
    returnIcon: {
      margin: 0,
      padding: 0,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.containerScroll}
        refreshControl={
          <RefreshControl
            colors={['#8bc34a']}
            size="large"
            refreshing={loading}
            onRefresh={loadMyStock}
          />
        }
      >
        <Text style={styles.title2}>MEU ESTOQUE</Text>
        <Divider />
        {!loading ? (
          <View style={!items.length ? styles.contentView : null}>
          {itemsOriginal.length ? (
            <SearchBar
              placeholder="Pesquisar Produto"
              onChangeText={updateSearch}
              containerStyle={styles.searchBarContainer}
              inputContainerStyle={styles.searchBarInputContainer}
              inputStyle={styles.searchBarInput}
              value={search}
            />
          ) : null}
            {items.length ? (
              items.map((item) => (
                <Card key={item.codigo}>
                  <View style={styles.titleContainer}>
                    <View style={styles.titleTextContainer}>
                      <Card.Title style={styles.itemTitle}>
                        {item.produto} - {Math.round(item.tamanho, 3)}
                        {item.medida}
                      </Card.Title>
                    </View>
                    <View style={styles.titleButtonContainer}>
                      <Button
                        type="solid"
                        icon={
                          <Icon
                            name="arrow-u-left-top-bold"
                            type="material-community"
                            color="white"
                            style={styles.returnIcon}
                            size={16}
                          />
                        }
                        color="white"
                        buttonStyle={styles.returnButton}
                        onPress={returnItem}
                      />
                    </View>
                  </View>
                  <Text style={styles.itemSubtitle}>{item.codigo}</Text>
                  <Divider style={{ marginBottom: 10 }} />
                  <Text>
                    <Text style={styles.bold}>OS:</Text> #
                    {item.os_concessionaria} {item.concessionaria}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>SERVIÇO:</Text> {item.servico}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>VEÍCULO:</Text> {item.veiculo}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>CHASSI:</Text> {item.chassi}
                  </Text>
                </Card>
              ))
            ) : (
              <EmptyHistory />
            )}
          </View>
        ) : null}
        <Dialog isVisible={showReturnDialog} onBackdropPress={returnItem}>
          <Dialog.Title title="Devolver Produto" />
          <Text>Você confirma que devolveu o Produto?</Text>
        </Dialog>
      </ScrollView>
      <BottomTabNavigator />
    </SafeAreaView>
  );
}
