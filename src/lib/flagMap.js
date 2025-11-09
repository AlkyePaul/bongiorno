export const flagMap = (name = "", flag = "") => {
    // Prefer an explicit two-letter flag code if provided in messages
    if (typeof flag === 'string' && /^[A-Z]{2}$/i.test(flag)) {
      return flag.toUpperCase();
    }
    const n = (name || '').toLowerCase();
    // Match across languages
    if (/(italia|italy|italie)/.test(n)) return "IT";
    if (/(spagna|spain|españa|espagne)/.test(n)) return "ES";
    if (/(francia|france)/.test(n)) return "FR";
    if (/(tunisia|tunesia|tunisie|túnez)/.test(n)) return "TN";
    if (/(algeria|algérie|algerie|argelia)/.test(n)) return "DZ";
    if (/(marocco|morocco|maroc)/.test(n)) return "MA";
    if (/(libia|libya|libye)/.test(n)) return "LY";
    if (/(mauritania|mauritanie)/.test(n)) return "MR";
    return ""; // unknown → let renderer decide fallback
  };