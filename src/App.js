import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import dayjs from 'dayjs';
import { AuthNavigator } from './Views/Layout/Navigators/AuthNavigator';
import { MainNavigator } from './Views/Layout/Navigators/MainNavigator';
import { AuthContext } from './Contexts/AuthContext';
import AuthService from './Services/AuthService';
import { NavigationTheme } from './Styles/NavigationTheme';
import ModulesBottomSheet from './Components/ModulesBottomSheet';
import 'dayjs/locale/pt-br';

const RootStack = createStackNavigator();

export default () => {
  const authServiceRef = React.useRef(null);
  if (!authServiceRef.current) authServiceRef.current = new AuthService();
  const authService = authServiceRef.current;
  const searchInput = React.createRef();

  const [loggedIn, setLoggendIn] = React.useState(false);
  const [onCamera, setOnCamera] = React.useState(false);
  const [barcodeValue, setBarcodeValue] = React.useState('');
  const [scanForItemIndex, setScanForItemIndex] = React.useState(null);
  const [continuousItemScan, setContinuousItemScan] = React.useState(false);
  const [scanSuccessFlashTrigger, setScanSuccessFlashTrigger] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const [displayModules, setDisplayModules] = React.useState(false);
  const [userModules, setUserModules] = React.useState([]);
  const [defaultModule, setDefaultModule] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [displaySearch, setDisplaySearch] = React.useState(false);

  const checkAuth = async () => {
    try {
      const result = await authService.checkAuth();
      setLoggendIn(!!result);
    } catch (e) {
      if (__DEV__) console.warn('checkAuth error', e);
      setLoggendIn(false);
    } finally {
      setLoaded(true);
    }
  };

  const getUserModules = async () => {
    try {
      await authService.defineTabs();
      const loggedUser = await authService.getUser();
      setUserModules(loggedUser?.modules ?? []);
    } catch (e) {
      if (__DEV__) console.warn('getUserModules error', e);
      setUserModules([]);
    }
  };

  const getDefaultModule = async () => {
    try {
      const module = await authService.getModule();
      setDefaultModule(module && typeof module === 'object' ? module : {});
    } catch (e) {
      if (__DEV__) console.warn('getDefaultModule error', e);
      setDefaultModule({});
    }
  };

  const auth = React.useMemo(
    () => ({
      checkAuth: async () => {
        checkAuth();
      },
      logIn: async (username, password) => {
        const credentials = {
          login: username,
          password,
        };

        return authService.signIn(credentials);
      },
      logOut: async () => {
        const result = await authService.logOut();

        if (result) {
          setUserModules([]);
          setDefaultModule({});
          setLoggendIn(false);
        }
      },
      getUser: async () => {
        const user = await authService.getUser();

        return user;
      },
      changeModule: async module => {
        authService.changeModule(module);
        getDefaultModule();
      },
      module: defaultModule,
      search,
      setSearch,
      displaySearch,
      setDisplaySearch,
      displayModules,
      setDisplayModules,
      searchInput,
      userModules,
      onCamera,
      setOnCamera,
      barcodeValue,
      setBarcodeValue,
      scanForItemIndex,
      setScanForItemIndex,
      continuousItemScan,
      setContinuousItemScan,
      scanSuccessFlashTrigger,
      setScanSuccessFlashTrigger,
    }),
    [
      defaultModule,
      search,
      displaySearch,
      displayModules,
      onCamera,
      barcodeValue,
      scanForItemIndex,
      continuousItemScan,
      scanSuccessFlashTrigger,
    ],
  );

  React.useEffect(() => {
    checkAuth();
    if (loggedIn) {
      getUserModules();
      getDefaultModule();
    }
  }, [loggedIn]);

  React.useEffect(() => {
    dayjs.locale('pt-br');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <AuthContext.Provider value={auth}>
      <NavigationContainer theme={NavigationTheme}>
        {loaded ? (
          <RootStack.Navigator
            screenOptions={{headerShown: false, animationEnabled: false}}>
            {loggedIn ? (
              <RootStack.Screen
                name="MainNavigator"
                component={MainNavigator}
              />
            ) : (
              <RootStack.Screen
                name="AuthNavigator"
                component={AuthNavigator}
              />
            )}
          </RootStack.Navigator>
        ) : null}
      </NavigationContainer>
      <ModulesBottomSheet />
    </AuthContext.Provider>
    </GestureHandlerRootView>
  );
};
