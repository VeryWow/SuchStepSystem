export class Step {
  constructor (params) {
    this.parent = params.parent || null
    this.name = params.name
    this.next = params.next
    this.methods = params.methods || {}
    this.template = params.template || ''
    this.ignore_progress = params.ignore_progress || false
    this.hide_progress = params.hide_progress || false
    this.from = null
    this.required = params.required || false
    this._data = params.data || {}
    params.interceptors = params.interceptors || {}
    this.interceptors = {
      isSkip: params.interceptors.isSkip || this.methods.isSkip || function () {
        return false
      },
      beforeRender: params.interceptors.beforeRender || this.methods.beforeRender || function () {
        return {status: true}
      },
      beforeNext: params.interceptors.beforeNext || this.methods.beforeNext || function () {
        return {status: true}
      },
      beforeBack: params.interceptors.beforeBack || this.methods.beforeBack || function () {
        return {status: true}
      }
    }
  }

  /* LINKS */
  get goNext () { return this.parent.goNext }
  get goBack () { return this.parent.goBack }
  get goToStep () { return this.parent.goToStep }

  get data () {
    return this._data
  }

  get container () {
    return this.parent.container.find(this.parent._step_container)
  }

  call (method, ...args) {
    let fnc = this.methods[method] || this.interceptors[method]
    if (fnc) {
      return fnc.apply(this, args)
    }
  }
}
