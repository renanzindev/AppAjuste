import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';

Utils.defaultModuleIndex().then((result) => {
  moduleIndex = result;
});

const OsServiceService = {
  search: async (data) => {
    try {
      const result = await Api.post(
        `${moduleIndex}/prefechamento/consultar/codigo`,
        data
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },
  searchProduct: async (data) => {
    try {
      const result = await Api.post(
        `${moduleIndex}/prefechamento/consultar/codigo/produto`,
        data
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },
};

export default OsServiceService;
