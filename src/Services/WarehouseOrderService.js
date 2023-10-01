import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';
const v3 = true;

const WarehouseOrderService = {
  myItems: async () => {
    try {
      await Utils.defaultModuleIndex(v3).then((result) => {
        moduleIndex = result;
      });

      const result = await Api.get(
        `${moduleIndex}/warehouses/orders/items/my-items`
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },

  confirmDelivery: async (data) => {
    try {
      await Utils.defaultModuleIndex(v3).then((result) => {
        moduleIndex = result;
      });

      const result = await Api.patch(
        `${moduleIndex}/warehouses/orders/items/confirm-delivery`,
        data
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },

  requestReturn: async (data) => {
    try {
      await Utils.defaultModuleIndex(v3).then((result) => {
        moduleIndex = result;
      });

      const result = await Api.patch(
        `${moduleIndex}/warehouses/orders/items/request-return`,
        data
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },
};

export default WarehouseOrderService;
