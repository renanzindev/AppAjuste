import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';
import { InteractionManager } from 'react-native';
import HomeView from '../../Pages/HomeView';
import CloseServiceView from '../../Pages/Production/CloseServiceView';
import PcpView from '../../Pages/Production/PcpView';
import TrackableShippingView from '../../Pages/Stock/TrackableShippingView';
import LogoutButton from '../../../Components/LogoutButton';
import FaqView from '../../Pages/FaqView';
import { AuthContext } from '../../../Contexts/AuthContext';
import ClosedServicesView from '../../Pages/Production/ClosedServicesView';
import ConfirmCheckoutView from '../../Pages/Logistics/ConfirmCheckoutView';
import PendingDeliveriesView from '../../Pages/Logistics/PendingDeliveriesView';
import LastDeliveriesView from '../../Pages/Logistics/LastDeliveriesView';

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
      case 'estoque':
        setViews(
          <Drawer.Screen
            name="TrackableShippingView"
            component={TrackableShippingView}
            options={{
              drawerLabel: 'Envio de Rastreáveis',
              drawerIcon: () => (
                <Icon name="barcode-scan" type="material-community" size={20} />
              ),
            }}
          />
        );
        break;
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
