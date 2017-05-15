/**
 * StepSystem v1.0.0
 * Last update: 15.05.2017
 *
 * Dependencies: jQuery
 *
 * @author kaskar2008
 */

export class StepSystem {
  /**
   * @param  {jQuery element} container
   */
  constructor (container) {
    this._steps = {}
    this._current_step = null
    this._container = container
    this.commonHandlers = function () {}
  }

  /**
   * Add new step
   * @param {Step} step
   */
  addStep (step) {
    step.parent = this
    this._steps.push(step)
    return this
  }

  setHandlers (cb) {
    this.commonHandlers = cb
    return this
  }

  get current_step () {
    return this.steps[this._current_step] || null
  }

  step (name) {
    return this._steps[name]
  }

  get container () {
    return this._container
  }

  get steps () {
    return this._steps
  }

  render (step) {
    let _br = step.interceptors.beforeRender()
    if (!_br.status) {
      if (_br.onError) _br.onError()
      return this
    }
    this.container.html(step.template)
  }

  goNext () {
    let _bn = step.interceptors.beforeNext()
    if (!_bn.status) {
      if (_bn.onError) _bn.onError()
      return this
    }
    let curr_step = this.current_step || {}
    let next_step = curr_step.next || null
    if (next_step) {
      this.goToStep(this.step(next_step))
    }
  }

  goBack () {
    let _bb = step.interceptors.beforeBack()
    if (!_bb.status) {
      if (_bb.onError) _bb.onError()
      return this
    }
    let curr_step = this.current_step || {}
    let prev_step = curr_step.from || null
    if (prev_step) {
      this.goToStep(this.step(prev_step))
    }
  }

  goToStep (step) {
    let curr_step = this.current_step || {}
    step.from = curr_step.name || null
    this.render(step)
  }

  init () {
    this.commonHandlers()
  }
}
