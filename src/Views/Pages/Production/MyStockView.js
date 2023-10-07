import React from 'react';
import Moment from 'moment';
import { StyleSheet, RefreshControl, Text, View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Badge, Button, Card, Divider, Icon, ListItem, Overlay } from '@rneui/themed';
import { Dialog, SearchBar } from '@rneui/themed';
import WarehouseOrderService from '../../../Services/WarehouseOrderService';
import EmptyHistory from '../../../Components/EmptyHistory';
import { useNavigation } from '@react-navigation/native';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

export default function MyStockView() {
  const [itemsOriginal, setItemsOriginal] = React.useState('');
  const [items, setItems] = React.useState('');
  const [pendingItems, setPendingItems] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showReturnDialog, setShowReturnDialog] = React.useState(false);
  const [showInfoDialog, setShowInfoDialog] = React.useState(false);
  const [search, setSearch] = React.useState(null);
  const [infoItem, setInfoItem] = React.useState({});
  const [index, setIndex] = React.useState(0);
  
  const navigation = useNavigation();

  const initialLayout = { width: Dimensions.get('window').width };

  const updateSearch = (searchValue) => {
    setSearch(searchValue);
  };

  const loadMyStock = async () => {
    setItemsOriginal([]);
    setLoading(true);

    const [ok, response] = await WarehouseOrderService.myItems();

    if (ok) setItemsOriginal(response.map((item) => {
      item.expanded = false;
      item.items = item.items.map((subItem) => {
        subItem.titulo = subItem.produto + ' - ' + Math.round(subItem.tamanho) + subItem.medida;

        return subItem;
      });

      return item;
    }));
  };

  const returnItem = () => {
    setShowReturnDialog(!showReturnDialog);
  };

  const toggleInfoDialog = (subItem = null) => {
    const taggleStatus = !showInfoDialog
    setShowInfoDialog(taggleStatus);
    if (taggleStatus && subItem) {
      setInfoItem(subItem);
    }else {
      setInfoItem({});
    }
  };

  const defineFilteredItems = () => {
    let filteredItems = [...itemsOriginal];

    filteredItems = filterItems(filteredItems);

    setItems([
      ...new Map(filteredItems.map((item) => [item.produto, item])).values(),
    ]);
  };

  const definePendingItems = () => {
    const originalItems = [...itemsOriginal];
    let results = [];

    originalItems.forEach((item) => {
      item.items.forEach((subItem) => {
        if (! subItem.data_recebimento) {
          results.push(subItem);
        }
      });
    });

    setPendingItems(results);
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

  const expandItem = (item) => {
    setItems(items.map((item2) => {
      if (item2 === item) {
        item2.expanded = !item2.expanded;
      }

      return item2;
    }));
  }
  const confirmDelivery = async (itemId) => {
    setLoading(true);
    const data = {
      estoque_saida_produto_id: itemId,
    }

    const [ok] = await WarehouseOrderService.confirmDelivery(data);

    if (ok) loadMyStock();
  }
  const requestReturn = async (itemId) => {
    setLoading(true);
    const data = {
      estoque_saida_produto_id: itemId,
    }

    const [ok] = await WarehouseOrderService.requestReturn(data);

    if (ok) loadMyStock();
  }

  const [routes] = React.useState([
    { key: 'myStock', title: 'ESTOQUE' },
    { key: 'pending', title: 'PENDENTES' },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      activeColor="#007d71"
      inactiveColor="#5d585c"
      indicatorStyle={{ backgroundColor: '#007d71' }}
      style={{ backgroundColor: 'white' }}
    />
  );

  React.useEffect(() => {
    defineFilteredItems();
    definePendingItems();
  }, [itemsOriginal]);

  React.useEffect(() => {
    setLoading(false);
  }, [itemsOriginal]);

  React.useEffect(() => {
    loadMyStock();
  }, []);

  const styles = StyleSheet.create({
    bold: {
      fontWeight: 'bold'
    },
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
      alignItems: 'flex-end',
    },
    subItemTextContainer: {
      width: '60%',
    },
    subItemButtonContainer: {
      width: '40%',
      alignItems: 'flex-end',
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
    itemRightButton: {
      paddingHorizontal: 10,
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
    badge: {
      width: 24,
      height: 24,
      marginRight: 10,
      borderRadius: 30,
    },
    badgeText: {
      fontSize: 16,
    },
    subListItem: {
      backgroundColor: '#eeeeee',
    },
    subListItemTitle: {
      fontSize: 18,
    },
    lineSpaced: {
      lineHeight: 25,
      color: '#5d585c',
    },
  });

  const renderScene = SceneMap({
    myStock: () => (!loading ? (
        <View style={!items.length ? styles.contentView : null}>
          {items.length ? (
            items.map((item) => (
              <ListItem.Accordion 
                key={item.produto} bottomDivider
                animation={{duration: '0ms'}}
                content={
                  <ListItem.Content style={styles.titleContainer}>
                    <View style={styles.titleTextContainer}>
                    <ListItem.Title>{item.produto}</ListItem.Title>
                    </View>
                    <View style={styles.titleButtonContainer}>
                      <Badge value={item.items.length} status="primary" textStyle={styles.badgeText} badgeStyle={styles.badge} />
                    </View>
                  </ListItem.Content>
                }
                isExpanded={item.expanded}
                onPress={() => {
                  expandItem(item);
                }}
              >
                {item.items.map((subItem, i) => (
                  <ListItem.Swipeable 
                    containerStyle={styles.subListItem}
                    key={subItem.codigo} 
                    bottomDivider
                    leftContent={subItem.data_recebimento && !subItem.data_devolucao ? () => (
                      <Button
                        title='Devolver'
                        icon={{ 
                          name: 'arrow-u-left-top-bold',
                          type: 'material-community', 
                          color: 'white'
                        }}
                        color="warning" 
                        buttonStyle={{ minHeight: '100%' }}
                        onPress={() => requestReturn(subItem.id)}
                      />
                    ) : !subItem.data_recebimento ? 
                    <Button
                      title='Confirmar'
                      icon={{ 
                        name: 'check',
                        color: 'white'
                      }}
                      color="success" 
                      buttonStyle={{ minHeight: '100%' }}
                      onPress={() => confirmDelivery(subItem.id)}
                    /> : null}
                    rightContent={() => (
                      <Button
                        title="Info"
                        icon={{ name: 'info', color: 'white' }}
                        buttonStyle={{ minHeight: '100%' }}
                        onPress={() => toggleInfoDialog(subItem)}
                      />
                    )}
                  >
                    <ListItem.Content>
                      <View style={styles.titleContainer}>
                        <View style={styles.subItemTextContainer}>
                          <ListItem.Title style={styles.subListItemTitle}>{subItem.codigo}</ListItem.Title>
                        </View>
                        <View style={styles.subItemButtonContainer}>
                          { !subItem.data_recebimento ? (
                          <Button title='Confirmar' 
                            icon={{
                              name: "check",
                              size: 14,
                              color: "white",
                            }} 
                            color="success" 
                            size="xs"
                            buttonStyle={styles.itemRightButton}
                            onPress={() => {
                              confirmDelivery(subItem.id)
                            }}
                            >
                          </Button>
                          ) : null }
                          { subItem.data_devolucao ? (
                          <Button title='Devolvido' 
                            icon={{
                              name: 'arrow-u-left-top-bold',
                              type: 'material-community', 
                              size: 14,
                              color: "white",
                            }} 
                            color="warning" 
                            size="xs"
                            buttonStyle={styles.itemRightButton}
                            >
                          </Button>
                          ) : null }
                        </View>
                      </View>
                      <ListItem.Subtitle>OS: #{subItem.os_concessionaria} | {subItem.concessionaria}</ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem.Swipeable>
                ))}
              </ListItem.Accordion>
            ))
          ) : (
            <EmptyHistory />
          )}
        </View>
      ) : null),
    pending: () => (!loading ? (
            <View style={!pendingItems.length ? styles.contentView : null}>
              {pendingItems.length ? (
                pendingItems.map((item) => (
                  <ListItem.Swipeable 
                    containerStyle={styles.listItem}
                    key={'pending_' + item.codigo} 
                    bottomDivider
                    leftContent={() => (
                    <Button
                      title='Confirmar'
                      icon={{
                        name: 'check',
                        color: 'white'
                      }}
                      color="success" 
                      buttonStyle={{ minHeight: '100%' }}
                      onPress={() => confirmDelivery(item.id)}
                    />)}
                    rightContent={() => (
                      <Button
                        title="Info"
                        icon={{ name: 'info', color: 'white' }}
                        buttonStyle={{ minHeight: '100%' }}
                        onPress={() => toggleInfoDialog(item)}
                      />
                    )}
                  >
                    <ListItem.Content>
                      <View style={styles.titleContainer}>
                        <View style={styles.subItemTextContainer}>
                          <ListItem.Title style={styles.subListItemTitle}>{item.produto}</ListItem.Title>
                        </View>
                        <View style={styles.subItemButtonContainer}>
                          <Button title='Confirmar' 
                            icon={{
                              name: "check",
                              size: 14,
                              color: "white",
                            }} 
                            color="success" 
                            size="xs"
                            buttonStyle={styles.itemRightButton}
                            onPress={() => {
                              confirmDelivery(item.id)
                            }}
                            >
                          </Button>
                        </View>
                      </View>
                      <ListItem.Subtitle>{item.codigo}</ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem.Swipeable>
                ))
              ) : (
                <EmptyHistory />
              )}
            </View>
          ) : null),
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
        <TabView
          lazy
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          swipeEnabled={false}
        />
        <Dialog isVisible={showInfoDialog} onBackdropPress={() => {toggleInfoDialog()}} 
          overlayStyle={{width: '90%'}}
        >
          <Dialog.Title titleStyle={{marginBottom: 0}} title={infoItem.titulo} />
          <Dialog.Title titleStyle={{fontSize: 20, marginBottom: 0}} title={infoItem.codigo} />
          <Divider style={{marginTop: 10, marginBottom: 10}}></Divider>
          <Text style={styles.lineSpaced}><Text style={styles.bold}>ENTREGUE POR:</Text> {infoItem.nome_entrega}</Text>
          <Text style={styles.lineSpaced}><Text style={styles.bold}>ENTREGUE EM:</Text> {Moment(infoItem.data_agendamento).format('DD/MM/YYYY HH:mm')}</Text>
          {infoItem.data_recebimento ? <Text style={styles.lineSpaced}><Text style={styles.bold}>CONFIRMADO EM:</Text> {Moment(infoItem.data_recebimento).format('DD/MM/YYYY HH:mm')}</Text> : null}
          {infoItem.data_devolucao ? <Text style={styles.lineSpaced}><Text style={styles.bold}>DEVOLVIDO EM:</Text> {Moment(infoItem.data_devolucao).format('DD/MM/YYYY HH:mm')}</Text> : null}
          <Divider style={{marginTop: 10, marginBottom: 10}}></Divider>
          <Text style={styles.lineSpaced}><Text style={styles.bold}>OS:</Text> #{infoItem.os_concessionaria} | {infoItem.concessionaria}</Text>
          <Text style={styles.lineSpaced}><Text style={styles.bold}>SERVIÇO:</Text> {infoItem.servico}</Text>
          <Text style={styles.lineSpaced}><Text style={styles.bold}>VEÍCULO:</Text> {infoItem.veiculo}</Text>
        </Dialog>

        <Dialog isVisible={showReturnDialog} onBackdropPress={returnItem}>
          <Dialog.Title title="Devolver Produto" />
          <Text>Você confirma que devolveu o Produto?</Text>
        </Dialog>
        <BottomTabNavigator />
        </ScrollView>
      </SafeAreaView>
  );
}
