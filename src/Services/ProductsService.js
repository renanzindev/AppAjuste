import Api from '../Config/Api';
import Utils from '../Config/Utils';

let moduleIndex = '';
const v3 = true;

const ProductsService = {
  index: async () => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });
      /* SUBSTITUIR estoque POR moduleIndex */
      const result = await Api.get(
        `estoque/produto/visualizar/naorastreavel`
      );

      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },
  
  requestProducts: async (data) => {
    try {
      await Utils.defaultModuleIndex().then((result) => {
        moduleIndex = result;
      });
      /* SUBSTITUIR vendas POR moduleIndex */
      const result = await Api.post(
        `vendas/estoque-saida/requisicoes/cadastrar`, data
      );
      console.log(result);
      return [result.ok, result.data];
    } catch (error) {
      return [false, error];
    }
  },
};

export default ProductsService;
