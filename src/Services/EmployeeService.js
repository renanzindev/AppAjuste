import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';

const EmployeeService = {
  actives: async () => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = await Api.get(
        `${moduleIndex}/funcionario/visualizar/ativos/minimo`
      );

      return [result.ok, result.data];
    } catch (error) {
      return [];
    }
  },
  productionWorkers: async () => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = await Api.get(
        `${moduleIndex}/funcionario/visualizar/produtivos/completo`
      );

      if (result.ok) return result.data;

      return [];
    } catch (error) {
      return [];
    }
  },
  productionWorkersByStore: async () => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = Api.get(
        `${moduleIndex}/funcionario/visualizar/produtivos/concessionarias`
      );

      if (result.ok) return result.data;

      return [];
    } catch (error) {
      return [];
    }
  },
  sellers: async () => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = Api.get(
        `${moduleIndex}/funcionario/visualizar/vendedores`
      );

      if (result.ok) return result.data;

      return [];
    } catch (error) {
      return [];
    }
  },
  birthdays: async () => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = await Api.get(
        `${moduleIndex}/funcionario/visualizar/aniversariantes`
      );

      if (result.ok) {
        return result.data;
      }

      return [];
    } catch (error) {
      return [];
    }
  },
};

export default EmployeeService;
