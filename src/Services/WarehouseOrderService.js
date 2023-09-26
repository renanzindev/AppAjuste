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
};

export default WarehouseOrderService;
