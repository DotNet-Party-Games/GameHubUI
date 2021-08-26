import { Hand } from "./hand";
import { Deck, Card } from "./deck";

/**
 *  Implement a casino player in TypeScript
 *
 *   @constructor
 *   @param {string} name
 *   @param {number} initialMoney
 */
export class Player {
  readonly hands: Array<Hand>;
  private _bet: number;
  private _actualMoney: number;
  private _deck: Deck;

  constructor(
    readonly name: string,
    readonly initialMoney: number,
    deck: Deck
  ) {
    this._bet = 0;
    this._actualMoney = initialMoney;
    this.hands = [new Hand(deck)];
    this._deck = deck;
  }

  get bet(): number {
    return this._bet;
  }

  set bet(value: number) {
    if (value < 0) throw new RangeError("Cannot assign a negative number");
    this._bet = value;
  }

  get actualMoney(): number {
    return this._actualMoney;
  }

  set actualMoney(value: number) {
    if (value < 0) throw new RangeError("Cannot assign to a negative number");
    this._actualMoney = value;
  }

  public resetHands = () =>
    this.hands.forEach((hand: Hand) => hand.initializeAttributes());

  public hit = (handIndex: number) => this.hands[handIndex].dealCard();

  /**
   * @returns An optional error message
   */

  public win(): number {
    const moneyBefore: number = this._actualMoney;
    this._actualMoney += this._bet;

    // If has a BlackJack, sums 1.5 times the actual bet, otherwise just 1 time
    if (this.hands[0].hasBlackJack()) {
      this._actualMoney += this._bet / 2;
    }
    if (this.hands.length > 1 && this.hands[1].hasBlackJack()) {
      this._actualMoney += this._bet / 2;
    }
    return this._actualMoney - moneyBefore;
  }

  public lose() {
    this._actualMoney -= this._bet;
  }

  public toString = (): string => this.name;
}
