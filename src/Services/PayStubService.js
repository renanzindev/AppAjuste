import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';
const v3 = true;

const PayStubService = {
  index: async (monthYear) => {
    try {
      await Utils.defaultModuleIndex(v3).then((result) => {
        moduleIndex = result;
      });
      const result = await Api.get(
        `${moduleIndex}/employees/paystubs/user/${monthYear}`
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },

  getPDF: async (year, month) => {
    await Utils.defaultModuleIndex(v3).then((result) => {
      moduleIndex = result;
    });

    await Api.download(
      'GET',
      `${moduleIndex}/employees/paystubs/user/pdf/${year}/${month}`,
      {
        filename: `holerite_${month}_${year}.pdf`,
        mime: `application/pdf`,
      }
    );
  },
};

export default PayStubService;
