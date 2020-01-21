export namespace CommonFormats {
  export enum Sport {
    TENNIS = 'TENNIS',
    SOCCER = 'SOCCER',
    BASKETBALL = 'BASKETBALL'
  }

  export enum Bookmaker {
    FONBET = 'FONBET',
    OLIMP = 'OLIMP',
    BET365 = 'BET365'
  }

  export interface SportEvent {
    sport: Sport;
    league: string;
    firstName: string;
    secondName: string;
  }

  export interface Factor {
    event: SportEvent;
    scope: Scope;
    betType: BetType;
    bookmaker: Bookmaker;
    value: number;
    updated: string;
    extra: ExtraData;
    deleted: boolean;
  }

  export interface ExtraData {
    [key: string]: any;

    eventId: string;
    sportId: string;
  }

  /**
   * Инфа по группе
   */
  export type Scope = Match | NumSets | Set | Game | Half | Quarter;

  export enum ScopeType {
    MATCH = 'Scope.Match',
    NUM_SETS = 'Scope.NumSets',
    SET = 'Scope.Set',
    GAME = 'Scope.Game',
    HALF = 'Scope.Half',
    QUARTER = 'Scope.Quarter'
  }

  export interface Match {
    type: ScopeType.MATCH;
  }

  export interface NumSets {
    type: ScopeType.NUM_SETS;
  }

  export interface Set {
    type: ScopeType.SET,
    set: number;
  }

  export interface Game {
    type: ScopeType.GAME;
    set: number;
    game: number;
  }

  export interface Half {
    type: ScopeType.HALF,
    half: number;
  }

  export interface Quarter {
    type: ScopeType.QUARTER,
    quarter: number;
  }

  /**
   * Тип ставки
   */
  export type BetType = Win | Handicap | Total | Parity | TwoWay;

  export enum EBetType {
    WIN = 'BetType.Win',
    HANDICAP = 'BetType.Handicap',
    TOTAL = 'BetType.Total',
    PARITY = 'BetType.Parity',
    TWO_WAY = 'BetType.TwoWay'
  }

  /**
   * 1 - победит первая
   * Х - ничья
   * 1Х - победа или ничья первой
   * 12 - исключает ничью
   */
// export type Outcome = '1' | '2' | 'X' | '1X' | '2X' | '12';
  export enum Outcome {
    ONE = 'ONE',
    TWO = 'TWO',
    X = 'X'
  }

  export interface Win {
    type: EBetType.WIN;
    outcome: Outcome[];
  }

  export enum EHandicapSide {
    TEAM1 = 'TEAM1',
    TEAM2 = 'TEAM2'
  }

  /**
   * Фора
   */
  export interface Handicap {
    type: EBetType.HANDICAP;
    side: EHandicapSide;
    handicap: number;
  }

  export enum ETotalSubject {
    ALL = 'ALL',
    TEAM1 = 'TEAM1',
    TEAM2 = 'TEAM2'
  }

  export enum ETotalDirection {
    OVER = 'OVER',
    UNDER = 'UNDER',
    EQUAL = 'EQUAL'
  }

  export interface Total {
    type: EBetType.TOTAL;
    /**
     * Общий и индивидуальные тоталы
     */
    subject: ETotalSubject;
    direction: ETotalDirection;
    total: number;
  }

  export enum EParity {
    ODD = 'ODD',
    EVEN = 'EVEN'
  }

  export interface Parity {
    type: EBetType.PARITY;
    parity: EParity;
  }

  export interface TwoWay {
    type: EBetType.TWO_WAY;
    /**
     * Enum
     */
    subject: string;
    /**
     * Да/нет
     */
    result: boolean;
  }

}
