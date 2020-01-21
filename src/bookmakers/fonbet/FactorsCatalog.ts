export namespace FactorsCatalog {
  export type FactorExtrass = {
    title: string;
    subtitle: string;
    outcome: string;
  }

  export type FactorsCatalogUpdateCell = {
    name: string;
    kind: string;
    factorId: number;
  }

  export type FactorsCatalogUpdateRow = FactorsCatalogUpdateCell[]

  export type FactorsCatalogUpdateTable = {
    name?: string;
    num: number;
    sortByParam?: boolean;
    isMain?: boolean;
    rows: FactorsCatalogUpdateRow[];
  }

  export type FactorsCatalogUpdateGroup = {
    name: string;
    tables: FactorsCatalogUpdateTable[];
  }

  export type FactorsCatalogUpdate = {
    request: string;
    result: string;
    lang: string;
    version: number;
    groups: FactorsCatalogUpdateGroup[];
  }
}
