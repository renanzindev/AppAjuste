import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';

const DeliveryPackageService = {
  pendingDeliveries: async () => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = await Api.get(
        `${moduleIndex}/logistica-expedicao/entregas-pendentes`
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },

  lastDeliveries: async () => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = await Api.get(
        `${moduleIndex}/logistica-expedicao/ultimas-entregas`
      );

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
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

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
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

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
