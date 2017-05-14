import { Step } from 'Step'

export class StepSystem {
  constructor () {
    this._steps = []
  }

  addStep (params) {
    this._steps.push(new Step (this, params))
  }

  get steps () {
    return this._steps
  }
}
