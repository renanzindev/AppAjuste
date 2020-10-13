import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';

Utils.defaultModuleIndex().then((result) => {
  moduleIndex = result;
});

const EmployeeService = {
  productionWorkers: async () => {
    try {
      const result = await Api.get(
        `${moduleIndex}/funcionario/visualizar/produtivos/completo`,
      );

      if (result.ok) return result.data;

      return [];
    } catch (error) {
      return [];
    }
  },
  productionWorkersByStore: async () => {
    try {
      const result = Api.get(
        `${moduleIndex}/funcionario/visualizar/produtivos/concessionarias`,
      );

      if (result.ok) return result.data;

      return [];
    } catch (error) {
      return [];
    }
  },
  sellers: async () => {
    try {
      const result = Api.get(
        `${moduleIndex}/funcionario/visualizar/vendedores`,
      );

      if (result.ok) return result.data;

      return [];
    } catch (error) {
      return [];
    }
  },
  birthdays: async () => {
    try {
      const result = await Api.get(
        `${moduleIndex}/funcionario/visualizar/aniversariantes`,
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
