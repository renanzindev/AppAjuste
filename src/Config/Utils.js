import AsyncStorage from '@react-native-community/async-storage';

const Utils = {
  defaultModuleIndex: async () => {
    try {
      const result = await AsyncStorage.getItem('@smartApp:module');
      const module = JSON.parse(result);

      return `/${module.index}`;
    } catch (error) {
      return '';
    }
  },
};

export default Utils;
