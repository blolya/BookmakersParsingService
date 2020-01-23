export namespace FactorsCatalogUpdate {

  export const url = "https://line11.bkfon-resource.ru/line/factorsCatalog/tables/?lang=en&version=0";

  export type Extrass = {
    title: string;
    subtitle: string;
    outcome: string;
  }

  export type Cell = {
    name: string;
    kind: string;
    factorId: number;
  }

  export type Row = Cell[]

  export type Table = {
    name?: string;
    num: number;
    sortByParam?: boolean;
    isMain?: boolean;
    rows: Row[];
  }

  export type Group = {
    name: string;
    tables: Table[];
  }

  export type Catalog = {
    request: string;
    result: string;
    lang: string;
    version: number;
    groups: Group[];
  }
}
