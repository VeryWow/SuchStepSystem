export class Step {
  constructor (parent, params) {
    this.parent = parent
    this.params = params
    this._lo = 'lol'
  }

  get lol () {
    return this._lo
  }
}
