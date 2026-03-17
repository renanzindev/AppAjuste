/**
 * Regra de negócio dinâmica: define se um item da expedição exige leitura de código (scanner)
 * ou deve ser marcado como validado automaticamente.
 * Base: expedicao_tipo do lote + rastreavel por item (quando aplicável).
 *
 * PLOTTER: todos os itens exigem leitura (rastreavel ignorado).
 * ESTOQUE: rastreavel 1 → exige leitura; rastreavel 0 → validação automática.
 */

/**
 * @param {string|null|undefined} expedicaoTipo - Tipo da expedição (ex.: deliveryPackage.expedicao_tipo)
 * @param {object|null|undefined} detail - Item do array detalhes (pode ter rastreavel)
 * @returns {boolean} true se o item deve exigir leitura de código; false se deve ser auto-validado
 */
export function itemRequiresScan(expedicaoTipo, detail) {
  const tipo = (expedicaoTipo ?? '').toString().trim().toUpperCase();
  if (tipo === 'PLOTTER') {
    return true;
  }
  if (tipo === 'ESTOQUE') {
    const rastreavel = detail?.rastreavel;
    if (rastreavel === 1 || rastreavel === true) return true;
    if (rastreavel === 0 || rastreavel === false || rastreavel == null) return false;
    return Boolean(rastreavel);
  }
  return true;
}
