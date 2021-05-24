import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';

const PcpService = {
  index: async () => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });

      const result = await Api.get(
        `${moduleIndex}/pcp-agendamento/pendentes/produtivo`
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },
};

export default PcpService;
