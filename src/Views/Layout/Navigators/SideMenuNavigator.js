import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from '@rneui/themed';
import { InteractionManager } from 'react-native';
import HomeView from '../../Pages/HomeView';
import PayStubView from '../../Pages/PayStubView';
import CloseServiceView from '../../Pages/Production/CloseServiceView';
import RequestProductsView from '../../Pages/Production/RequestProductsView';
import PcpView from '../../Pages/Production/PcpView';
import LogoutButton from '../../../Components/LogoutButton';
import FaqView from '../../Pages/FaqView';
import { AuthContext } from '../../../Contexts/AuthContext';
import ClosedServicesView from '../../Pages/Production/ClosedServicesView';
import ClosedServicesPeriodView from '../../Pages/Production/ClosedServicesPeriodView';
import ConfirmCheckoutView from '../../Pages/Logistics/ConfirmCheckoutView';
import PendingDeliveriesView from '../../Pages/Logistics/PendingDeliveriesView';
import CheckoutCarView from '../../Pages/Logistics/CheckoutCarView';
import LastDeliveriesView from '../../Pages/Logistics/LastDeliveriesView';
import MyStockView from '../../Pages/Production/MyStockView';

const Drawer = createDrawerNavigator();

export default function SideMenuNavigator() {
  const { module } = React.useContext(AuthContext);
  const [loaded, setLoaded] = React.useState(false);
  const [views, setViews] = React.useState(null);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setLoaded(true);
    });
  }, []);

  React.useEffect(() => {
    switch (module.index) {
      case 'producao':
        setViews(
          <>
            <Drawer.Screen
              name="PcpView"
              component={PcpView}
              options={{
                drawerLabel: 'PCP',
                drawerIcon: () => (
                  <Icon name="calendar-today" type="material" size={20} />
                ),
              }}
            />
            <Drawer.Screen
              name="RequestProductsView"
              component={RequestProductsView}
              options={{
                drawerLabel: 'REQUISITAR',
                drawerIcon: () => (
                  <Icon name="cart" type="material-community" size={20} />
                ),
              }}
            />
            <Drawer.Screen
              name="CloseServiceView"
              component={CloseServiceView}
              options={{
                drawerLabel: 'Fechar Serviço',
                drawerIcon: () => (
                  <Icon
                    name="tag-multiple"
                    type="material-community"
                    size={20}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="ClosedServicesView"
              component={ClosedServicesView}
              options={{
                drawerLabel: 'Últimos Fechamentos',
                drawerIcon: () => (
                  <Icon name="list" type="material" size={20} />
                ),
              }}
            />
            <Drawer.Screen
              name="MyStockView"
              component={MyStockView}
              options={{
                drawerLabel: 'Meu Estoque',
                drawerIcon: () => (
                  <Icon name="inventory" type="material" size={20} />
                ),
              }}
            />
            <Drawer.Screen
              name="ClosedServicesPeriodView"
              component={ClosedServicesPeriodView}
              options={{
                drawerLabel: 'Fech. Por Período',
                drawerIcon: () => (
                  <Icon
                    name="calendar-check"
                    type="material-community"
                    size={20}
                  />
                ),
              }}
            />
          </>
        );
        break;
      case 'logistica':
        setViews(
          <>
            <Drawer.Screen
              name="ConfirmCheckoutView"
              component={ConfirmCheckoutView}
              options={{
                drawerLabel: 'Retirada de Lote',
                drawerIcon: () => (
                  <Icon
                    name="barcode-scan"
                    type="material-community"
                    size={20}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="PendingDeliveriesView"
              component={PendingDeliveriesView}
              options={{
                drawerLabel: 'Lotes em Trânsito',
                drawerIcon: () => (
                  <Icon
                    name="truck-delivery"
                    type="material-community"
                    size={20}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="LastDeliveriesView"
              component={LastDeliveriesView}
              options={{
                drawerLabel: 'Últimas Entregas',
                drawerIcon: () => (
                  <Icon
                    name="truck-check"
                    type="material-community"
                    size={20}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="CheckoutCarView"
              component={CheckoutCarView}
              options={{
                drawerLabel: 'Checkout',
                drawerIcon: () => (
                  <Icon
                    name="car-side"
                    type="material-community"
                    size={20}
                  />
                ),
              }}
            />
          </>
        );
        break;

      default:
        setViews(null);
        break;
    }
  }, [module]);

  return loaded ? (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="HomeView"
      drawerContent={(props) => <LogoutButton {...props} />}
    >
      <Drawer.Screen
        name="HomeView"
        component={HomeView}
        options={{
          drawerLabel: 'INÍCIO',
          drawerIcon: () => <Icon name="home" size={20} />,
        }}
      />
      {/* <Drawer.Screen
        name="PayStubView"
        component={PayStubView}
        options={{
          drawerLabel: 'Holerite',
          drawerIcon: () => <Icon name="money" type="material" size={20} />,
        }}
      /> */}
      {views}

      <Drawer.Screen
        name="FaqView"
        component={FaqView}
        options={{
          drawerLabel: 'FAQ',
          drawerIcon: () => <Icon name="info" size={20} color="black" />,
        }}
      />
    </Drawer.Navigator>
  ) : null;
}
