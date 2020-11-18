import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';

Utils.defaultModuleIndex().then((result) => {
  moduleIndex = result;
});

const DeliveryPackageService = {
  pendingDeliveries: async () => {
    try {
      const result = await Api.get(
        `${moduleIndex}/logistica-expedicao/entregas-pendentes`
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },
  search: async (data) => {
    try {
      const result = await Api.post(
        `${moduleIndex}/logistica-expedicao/consultar-codigo`,
        data
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },
  confirmCheckout: async (data) => {
    try {
      const result = await Api.post(
        `${moduleIndex}/logistica-expedicao/confirmar-saida`,
        data
      );

      return result.ok;
    } catch (error) {
      return error;
    }
  },
  confirmDelivery: async (data) => {
    try {
      const result = await Api.post(
        `${moduleIndex}/logistica-expedicao/confirmar-entrega`,
        data
      );

      return result.ok;
    } catch (error) {
      return error;
    }
  },
};

export default DeliveryPackageService;
