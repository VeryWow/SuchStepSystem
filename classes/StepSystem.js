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
    this.steps_past = []
    this.onFinish = null
    this.commonHandlers = function () {}
  }

  /**
   * Add new step
   * @param {Step} step
   */
  addStep (step) {
    step.parent = this
    this._steps[step.name] = step
    return this
  }

  setHandlers (cb) {
    this.commonHandlers = cb
    return this
  }

  get current_step () {
    return this.step(this._current_step) || null
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
    this.container.find('.step').html(step.template || this._container.find(`#${step.name}`).html())
    if (step.methods.onRender) {
      step.methods.onRender()
    }
  }

  goNext () {
    let curr_step = this.current_step || {}
    let next_step = curr_step.next || null
    let _bn = curr_step.interceptors.beforeNext()
    if (!_bn.status) {
      if (_bn.onError) _bn.onError()
      return this
    }
    if (next_step) {
      this.goToStep(this.step(next_step), curr_step.name)
    } else {
      if (this.onFinish) {
        this.onFinish()
      }
    }
  }

  goBack () {
    let curr_step = this.current_step || {}
    let prev_step = curr_step.from || null
    let _bb = curr_step.interceptors.beforeBack()
    if (!_bb.status) {
      if (_bb.onError) _bb.onError()
      return this
    }
    if (prev_step) {
      this.goToStep(this.step(prev_step))
      this.steps_past.pop()
    }
  }

  goToStep (step, from = null) {
    if (from) {
      step.from = from
    }
    this._current_step = step.name
    this.render(step)
    if (this.steps_past.indexOf(step.name) < 0) {
      this.steps_past.push(step.name)
    }
  }

  collectData () {
    let data = {}
    for (var step in this.steps_past) {
      data[this.steps_past[step]] = this.step(this.steps_past[step]).data
    }
    return data
  }

  init (from_step) {
    this.commonHandlers()
    this._current_step = from_step
    this.goToStep(this.step(this._current_step))
  }
}
