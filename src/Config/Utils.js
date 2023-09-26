import AsyncStorage from '@react-native-async-storage/async-storage';

const Utils = {
  defaultModuleIndex: async (v3 = false) => {
    try {
      const result = await AsyncStorage.getItem('@smartApp:module');
      const module = JSON.parse(result);

      return v3 ? `/v3/${module.index_v3}` : `/${module.index}`;
    } catch (error) {
      return '';
    }
  },
};

export default Utils;
