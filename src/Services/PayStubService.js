import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';
const v3 = true;

const PayStubService = {
  index: async (monthYear, type) => {
    try {
      await Utils.defaultModuleIndex(v3).then((result) => {
        moduleIndex = result;
      });
      const result = await Api.get(
        `${moduleIndex}/employees/paystubs/user/${monthYear}/${type}`
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },

  getPDF: async (year, month, type) => {
    await Utils.defaultModuleIndex(v3).then((result) => {
      moduleIndex = result;
    });

    await Api.download(
      'GET',
      `${moduleIndex}/employees/paystubs/user/pdf/${year}/${month}/${type}`,
      {
        filename: `holerite_${month}_${year}_tipo_${type}.pdf`,
        mime: `application/pdf`,
      }
    );
  },
};

export default PayStubService;
