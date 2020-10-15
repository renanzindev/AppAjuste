import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';

Utils.defaultModuleIndex().then((result) => {
  moduleIndex = result;
});

const PcpService = {
  index: async () => {
    try {
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
