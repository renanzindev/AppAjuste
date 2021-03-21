import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';

const OsServiceService = {
  index: async () => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = await Api.get(`${moduleIndex}/prefechamento`);

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },
  search: async (data) => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = await Api.post(
        `${moduleIndex}/prefechamento/consultar/codigo`,
        data
      );
      console.log(result);

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },
  searchProduct: async (data) => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = await Api.post(
        `${moduleIndex}/prefechamento/consultar/codigo/produto`,
        data
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },
  closeService: async (data) => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = await Api.post(`${moduleIndex}/prefechamento/novo`, data);

      return result.ok;
    } catch (error) {
      return error;
    }
  },
};

export default OsServiceService;
