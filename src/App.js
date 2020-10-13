import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Moment from 'moment';
import { AuthNavigator } from './Views/Layout/Navigators/AuthNavigator';
import { MainNavigator } from './Views/Layout/Navigators/MainNavigator';
import { AuthContext } from './Contexts/AuthContext';
import AuthService from './Services/AuthService';
import { NavigationTheme } from './Styles/NavigationTheme';
import ModulesBottomSheet from './Components/ModulesBottomSheet';
import 'moment/locale/pt-br';

const RootStack = createStackNavigator();

export default () => {
  const authService = new AuthService();
  const searchInput = React.createRef();

  const [loggedIn, setLoggendIn] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [displayModules, setDisplayModules] = React.useState(false);
  const [user, setUser] = React.useState([]);
  const [userModules, setUserModules] = React.useState([]);
  const [defaultModule, setDefaultModule] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [displaySearch, setDisplaySearch] = React.useState(false);

  const checkAuth = async () => {
    const result = await authService.checkAuth();
    setLoggendIn(result);
    setLoaded(true);
  };

  const getUserModules = async () => {
    await authService.defineTabs();
    const loggedUser = await authService.getUser();
    setUser(loggedUser);
    setUserModules(loggedUser.modules);
  };

  const getDefaultModule = async () => {
    const module = await authService.getModule();
    setDefaultModule(module);
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
      changeModule: async (module) => {
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
      user,
    }),
    [defaultModule, search, displaySearch, displayModules]
  );

  React.useEffect(() => {
    checkAuth();
    if (loggedIn) {
      getUserModules();
      getDefaultModule();
    }
  }, [loggedIn]);

  React.useEffect(() => {
    Moment.locale('pt-br');
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      <NavigationContainer theme={NavigationTheme}>
        {loaded ? (
          <RootStack.Navigator
            screenOptions={{ headerShown: false, animationEnabled: false }}
          >
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
  );
};
