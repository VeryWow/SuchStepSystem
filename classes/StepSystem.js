/**
 * StepSystem v1.0.0
 * Last update: 19.05.2017
 *
 * Dependencies: jQuery
 *
 * @author kaskar2008
 */

export class StepSystem {
  /**
   * @param  {jQuery element} container
   */
  constructor (params) {
    this._steps = {}
    this._current_step = null
    this._container = params.container || $('.step-system')
    this._step_container = params.step_class || '.step'
    this._next_timeout = null
    this.steps_past = []
    this.progress = 0
    this.commonHandlers = function () {}
    this.onFinish = function () {}
    this.onProgress = function () {}
    this.onStepRender = function () {}
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

  get all_data () {
    return this.collectData()
  }

  render (step) {
    let _br = step.interceptors.beforeRender(step)
    if (!_br.status) {
      if (_br.onError) _br.onError()
      return this
    }
    this.container.find(this._step_container).html(step.template || this._container.find(`#${step.name}`).html())
    this.container.find(this._step_container).attr('data-name', step.name)
    this.onStepRender(step)
    if (step.methods.onRender) {
      step.methods.onRender(step)
    }
  }

  updateProgress () {
    let future_steps = 0
    let iteration_step = this.current_step
    let iteration_next_step = iteration_step.next
    while (iteration_next_step) {
      if (!iteration_step.ignore_progress) {
        future_steps++
      }
      iteration_step = this.step(iteration_next_step)
      iteration_next_step = iteration_step.next
    }
    this.progress = (this.steps_past.length * 100) / (this.steps_past.length + future_steps)
    this.onProgress(this.progress)
  }

  finish () {
    if (this.onFinish) {
      this.onFinish()
    }
  }

  goNextTimeout (timeout = 300) {
    const $this = this
    clearTimeout(this._next_timeout)
    this._next_timeout = setTimeout(function () {
      $this.goNext()
    }, timeout)
  }

  goNext () {
    let curr_step = this.current_step || {}
    let next_step = curr_step.next || null
    let _bn = curr_step.interceptors.beforeNext(curr_step)
    if (!_bn.status) {
      if (_bn.onError) _bn.onError()
      return this
    }
    if (next_step) {
      this.goToStep(this.step(next_step), { from: curr_step.name })
    } else {
      this.finish()
    }
  }

  goBack () {
    let curr_step = this.current_step || {}
    let prev_step = curr_step.from || null
    let _bb = curr_step.interceptors.beforeBack(curr_step) || { status: false }
    if (!_bb.status) {
      if (_bb.onError) _bb.onError()
      return this
    }
    if (prev_step) {
      if (_bb.status) {
        this.steps_past.pop()
      }
      this.goToStep(this.step(prev_step), { is_back: true })
    }
  }

  goToStep (step, params = {}) {
    let from = params.from || null
    let is_back = params.is_back || false
    if (from) {
      step.from = from
    }
    this.render(step)
    this._current_step = step.name
    if (this.steps_past.indexOf(step.name) < 0) {
      this.steps_past.push(step.name)
    }
    this.updateProgress()
  }

  collectData () {
    let data = {}
    for (var step in this.steps) {
      if (this.step(step).data) {
        data[step] = this.step(step).data
      }
    }
    return data
  }

  init (first_step) {
    this.first_step = first_step
    this.commonHandlers()
    this._current_step = this.first_step
    this.goToStep(this.step(this._current_step))
  }
}
