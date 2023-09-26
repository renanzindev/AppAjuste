import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {InteractionManager} from 'react-native';
import {AuthContext} from '../../../Contexts/AuthContext';
import SideMenuNavigator from './SideMenuNavigator';
import {NavigationStyles} from '../../../Styles/NavigationStyles';
import MainHeaderLeft from '../../../Components/MainHeaderLeft';
// import MainHeaderRight from '../../../Components/MainHeaderRight';
import MainHeaderTitle from '../../../Components/MainHeaderTitle';
import ConfirmDeliveryView from '../../Pages/Logistics/ConfirmDeliveryView';

const MainStack = createStackNavigator();

export function MainNavigator() {
  const {module, setSearch, displaySearch, searchInput} =
    React.useContext(AuthContext);

  const screenOptions = {
    animationEnabled: false,
  };
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setLoaded(true);
    });
  }, []);

  React.useEffect(() => {
    if (displaySearch) {
      searchInput.current.focus();
    } else {
      setSearch('');
    }
  }, [displaySearch, searchInput, setSearch]);

  return loaded ? (
    <MainStack.Navigator screenOptions={screenOptions}>
      <MainStack.Screen
        name="SideMenuNavigator"
        component={SideMenuNavigator}
        options={{
          headerTitle: () => <MainHeaderTitle />,
          headerLeft: () => <MainHeaderLeft />,
          // headerRight: () => <MainHeaderRight />,
          headerStyle: NavigationStyles.header(module),
        }}
      />
      <MainStack.Screen
        name="ConfirmDeliveryView"
        component={ConfirmDeliveryView}
        options={{
          headerShown: false,
        }}
      />
    </MainStack.Navigator>
  ) : null;
}
