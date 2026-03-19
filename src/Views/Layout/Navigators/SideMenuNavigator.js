import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from '@rneui/themed';
import MainHeaderLeft from '../../../Components/MainHeaderLeft';
import MainHeaderTitle from '../../../Components/MainHeaderTitle';
import { NavigationStyles } from '../../../Styles/NavigationStyles';
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
  const [views, setViews] = React.useState(null);

  const moduleIndex = module && typeof module === 'object' ? module.index : undefined;

  React.useEffect(() => {
    switch (moduleIndex) {
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
            {/* <Drawer.Screen
              name="RequestProductsView"
              component={RequestProductsView}
              options={{
                drawerLabel: 'REQUISITAR',
                drawerIcon: () => (
                  <Icon name="cart" type="material-community" size={20} />
                ),
              }}
            /> */}
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
              initialParams={{
                title: 'CheckIn',
                buttonName: 'Confirmar CheckIn',
                prefix: 'CheckIn: O veículo está em condições para executar os serviços?\n\n'
              }}
              options={{
                drawerLabel: 'CheckIn',
                drawerIcon: () => (
                  <Icon
                    name="car-side"
                    type="material-community"
                    size={20}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="CheckoutCarView1"
              component={CheckoutCarView}
              initialParams={{
                title: 'Qualidade Serviço',
                buttonName: 'Assinatura',
                prefix: 'CheckOut: Você aprova a qualidade dos serviços realizados? Porque?\n\n'
              }}
              options={{
                drawerLabel: 'Qualidade Serviço',
                drawerIcon: () => (
                  <Icon
                    name="car-sports"
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
  }, [moduleIndex]);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: () => <MainHeaderTitle />,
        headerLeft: () => <MainHeaderLeft />,
        headerStyle: NavigationStyles.header(module || {}),
        headerShadowVisible: false,
      }}
      initialRouteName="HomeView"
      drawerContent={({ key, ...restProps }) => <LogoutButton {...restProps} />}
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
  );
}
