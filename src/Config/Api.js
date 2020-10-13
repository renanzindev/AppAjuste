import { create } from 'apisauce';
import AsyncStorage from '@react-native-community/async-storage';

const Api = create({
  baseURL: 'https://dev.valorizandoseucarro.com.br/api',
});

Api.addAsyncRequestTransform((request) => async () => {
  try {
    const token = await AsyncStorage.getItem('@smartApp:token');
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {}
});

export default Api;
