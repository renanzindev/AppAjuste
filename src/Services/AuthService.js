import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../Config/Api';
import {appModules, appModulesTabs} from '../Config/Modules';

export default class Auth {
  signIn = async credentials => {
    try {
      credentials.app_token = true;
      const response = await Api.post('/auth', credentials);

      if (response.ok) {
        const {token} = response.data;
        const user = response.data.usuario;

        user.modules = response.data.usuario.grupo_usuario.modulos.filter(
          userModule => appModules.includes(userModule.id),
        );

        user.modules = user.modules.map(userModule => ({
          id: userModule.id,
          name: userModule.nome,
          index: userModule.index,
          index_v3: userModule.index_v3,
          tabs: appModulesTabs[userModule.index],
          default: !!userModule.pivot.padrao,
        }));

        let module = null;

        user.modules.forEach(userModule => {
          if (userModule.default) {
            module = userModule;
          }
        });

        if (!module) {
          [module] = user.modules;
        }

        AsyncStorage.multiSet([
          ['@smartApp:user', JSON.stringify(user)],
          ['@smartApp:module', JSON.stringify(module)],
          ['@smartApp:token', token],
        ]);

        return true;
      }

      if (response.problem === 'NETWORK_ERROR') {
        return 'Não foi possível se comunicar com o servidor, verifique sua conexão e tente novamente!';
      }

      return response.data.error;
    } catch (error) {
      await this.logOut();

      return 'Ocorreu um erro inesperado, entre em contato com o suporte!';
    }
  };

  logOut = async () => {
    await AsyncStorage.clear();

    return true;
  };

  checkAuth = async () => {
    const token = await AsyncStorage.getItem('@smartApp:token');
    return !!token;
  };

  getUser = async () => {
    try {
      const result = (await AsyncStorage.getItem('@smartApp:user')) || {};

      return JSON.parse(result);
    } catch (error) {}

    return {};
  };

  getModule = async () => {
    try {
      const result = (await AsyncStorage.getItem('@smartApp:module')) || {};

      return JSON.parse(result);
    } catch (error) {}

    return {};
  };

  changeModule = async module => {
    AsyncStorage.setItem('@smartApp:module', JSON.stringify(module));
  };

  defineTabs = async () => {
    try {
      let user = await AsyncStorage.getItem('@smartApp:user');
      user = JSON.parse(user);

      user.modules.forEach(userModule => {
        userModule.tabs = appModulesTabs[userModule.index];
      });

      await AsyncStorage.setItem('@smartApp:user', JSON.stringify(user));
    } catch (error) {}
  };
}
