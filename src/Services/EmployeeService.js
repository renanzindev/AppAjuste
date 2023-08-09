import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';

const EmployeeService = {
  actives: async () => {
    try {
      await Utils.defaultModuleIndex(true).then((result) => {
        moduleIndex = result;
      });

      const result = await Api.get(
        `${moduleIndex}/employees?situation=1&simplified=1`
      );

      return [result.ok, result.data];
    } catch (error) {
      return [];
    }
  },

  birthdays: async () => {
    try {
      await Utils.defaultModuleIndex(true).then((result) => {
        moduleIndex = result;
      });

      const result = await Api.get(
        `${moduleIndex}/employees/birthdays`
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
