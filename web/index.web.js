import React from 'react';
import { AppRegistry } from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { AuthContext } from '../src/Contexts/AuthContext';
import AuthService from '../src/Services/AuthService';
import WebApp from './pages/WebApp';

dayjs.locale('pt-br');

const authService = new AuthService();

function Root() {
  const searchInput = React.createRef();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [userModules, setUserModules] = React.useState([]);
  const [defaultModule, setDefaultModule] = React.useState({});
  const [displayModules, setDisplayModules] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [displaySearch, setDisplaySearch] = React.useState(false);
  const [onCamera, setOnCamera] = React.useState(false);
  const [barcodeValue, setBarcodeValue] = React.useState('');

  const checkAuth = async () => {
    const result = await authService.checkAuth();
    setLoggedIn(result);
    setLoaded(true);
    return result;
  };

  const getUserModules = async () => {
    await authService.defineTabs();
    const loggedUser = await authService.getUser();
    setUserModules(loggedUser?.modules ?? []);
  };

  const getDefaultModule = async () => {
    const module = await authService.getModule();
    setDefaultModule(module);
  };

  const auth = React.useMemo(
    () => ({
      checkAuth: async () => checkAuth(),
      logIn: async (username, password) => {
        const result = await authService.signIn({ login: username, password });
        if (result) {
          await checkAuth();
          await getUserModules();
          await getDefaultModule();
        }
        return result;
      },
      logOut: async () => {
        const result = await authService.logOut();
        if (result) {
          setUserModules([]);
          setDefaultModule({});
          setLoggedIn(false);
        }
      },
      getUser: async () => authService.getUser(),
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
      onCamera,
      setOnCamera,
      barcodeValue,
      setBarcodeValue,
    }),
    [defaultModule, search, displaySearch, displayModules, onCamera, barcodeValue]
  );

  React.useEffect(() => {
    checkAuth();
  }, []);

  React.useEffect(() => {
    if (loggedIn) {
      getUserModules();
      getDefaultModule();
    }
  }, [loggedIn]);

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={auth}>
      <WebApp />
    </AuthContext.Provider>
  );
}

AppRegistry.registerComponent('smartApp2', () => Root);
AppRegistry.runApplication('smartApp2', {
  rootTag: document.getElementById('root'),
});
