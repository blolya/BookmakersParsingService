export namespace Update {

  export const url = "https://line01i.bkfon-resource.ru/live/updatesFromVersion/3184630894/en";

  export type Factor = {
    e: number,
    f: number,
    v: number,
    p: number,
    pt: string,
    isLive: boolean
  }

  export type Event = {
    id: number,
    parentId: number,
    sortOrder: string,
    level: number,
    num: number,
    sportId: number,
    kind: number,
    rootKind: number,
    state: object,
    team1Id: number,
    team2Id: number,
    team1: string,
    team2: string,
    name: string,
    namePrefix: string,
    startTime: number,
    place: string,
    priority: number
  }

  export type Sport = {
    id: number,
    parentId?: number,
    kind: string,
    regionId: number,
    sortOrder: string,
    name: string
  }

  export type Update = {
    packetVersion: number,
    fromVersion: number,
    factorsVersion: number,
    specialLineCatalogVersion: number,
    catalogTablesVersion: number,
    catalogSpecialTablesVersion: number,
    siteVersion: number,
    sports: Sport[],
    events: Event[],
    customFactors: Factor[]
  }
}
