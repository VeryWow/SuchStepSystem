(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Step = exports.Step = function () {
  function Step(params) {
    _classCallCheck(this, Step);

    this.parent = params.parent || null;
    this.name = params.name;
    this.next = params.next;
    this.methods = params.methods || {};
    this.template = params.template || '';
    this.ignore_progress = params.ignore_progress || false;
    this.hide_progress = params.hide_progress || false;
    this.from = null;
    this.required = params.required || false;
    this._data = params.data || {};
    params.interceptors = params.interceptors || {};
    this.interceptors = {
      isSkip: params.interceptors.isSkip || this.methods.isSkip || function () {
        return false;
      },
      beforeRender: params.interceptors.beforeRender || this.methods.beforeRender || function () {
        return { status: true };
      },
      beforeNext: params.interceptors.beforeNext || this.methods.beforeNext || function () {
        return { status: true };
      },
      beforeBack: params.interceptors.beforeBack || this.methods.beforeBack || function () {
        return { status: true };
      }
    };
  }

  /* LINKS */


  _createClass(Step, [{
    key: 'goNext',
    get: function get() {
      return this.parent.goNext;
    }
  }, {
    key: 'goBack',
    get: function get() {
      return this.parent.goBack;
    }
  }, {
    key: 'goToStep',
    get: function get() {
      return this.parent.goToStep;
    }
  }, {
    key: 'data',
    get: function get() {
      return this._data;
    }
  }]);

  return Step;
}();

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * StepSystem v1.0.1
 * Last update: 25.05.2017
 *
 * Dependencies: jQuery
 *
 * @author kaskar2008
 */

var StepSystem = exports.StepSystem = function () {
  /**
   * @param  {jQuery element} container
   */
  function StepSystem(params) {
    _classCallCheck(this, StepSystem);

    this._steps = {};
    this._current_step = null;
    this._container = params.container || $('.step-system');
    this._step_container = params.step_class || '.step';
    this._next_timeout = null;
    this.steps_past = [];
    this.progress = 0;
    this.commonHandlers = function () {};
    this.onFinish = function () {};
    this.onProgress = function () {};
    this.onStepRender = function () {};
  }

  /**
   * Add new step
   * @param {Step} step
   */


  _createClass(StepSystem, [{
    key: 'addStep',
    value: function addStep(step) {
      step.parent = this;
      this._steps[step.name] = step;
      return this;
    }
  }, {
    key: 'setHandlers',
    value: function setHandlers(cb) {
      this.commonHandlers = cb;
      return this;
    }
  }, {
    key: 'step',
    value: function step(name) {
      return this._steps[name];
    }
  }, {
    key: 'render',
    value: function render(step) {
      var _br = step.interceptors.beforeRender(step);
      if (!_br.status) {
        if (_br.onError) _br.onError();
        return this;
      }
      this.container.find(this._step_container).html(step.template || this._container.find('#' + step.name).html());
      this.container.find(this._step_container).attr('data-name', step.name);
      this.onStepRender(step);
      if (step.methods.onRender) {
        step.methods.onRender(step);
      }
    }
  }, {
    key: 'updateProgress',
    value: function updateProgress() {
      var future_steps = 0;
      var iteration_step = this.current_step;
      var iteration_next_step = iteration_step.next;
      while (iteration_next_step) {
        if (!iteration_step.ignore_progress) {
          future_steps++;
        }
        iteration_step = this.step(iteration_next_step);
        iteration_next_step = iteration_step.next;
      }
      this.progress = this.steps_past.length * 100 / (this.steps_past.length + future_steps);
      this.onProgress(this.progress);
    }
  }, {
    key: 'goNextTimeout',
    value: function goNextTimeout() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;

      var $this = this;
      clearTimeout(this._next_timeout);
      this._next_timeout = setTimeout(function () {
        $this.goNext();
      }, timeout);
    }
  }, {
    key: 'goNext',
    value: function goNext() {
      var curr_step = this.current_step || {};
      var next_step = curr_step.next || null;
      var _bn = curr_step.interceptors.beforeNext(curr_step);
      if (!_bn.status) {
        if (_bn.onError) _bn.onError();
        return this;
      }
      if (next_step) {
        this.goToStep(this.step(next_step), { from: curr_step.name });
      } else {
        if (this.onFinish) {
          this.onFinish();
        }
      }
      return this;
    }
  }, {
    key: 'goBack',
    value: function goBack() {
      var curr_step = this.current_step || {};
      var prev_step = curr_step.from || null;
      var _bb = curr_step.interceptors.beforeBack(curr_step) || { status: false };
      if (!_bb.status) {
        if (_bb.onError) _bb.onError();
        return this;
      }
      if (prev_step) {
        if (_bb.status) {
          this.steps_past.pop();
        }
        this.goToStep(this.step(prev_step), { is_back: true });
      }
      return this;
    }
  }, {
    key: 'goToStep',
    value: function goToStep(step) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var is_skip = step.interceptors.isSkip(step);
      if (is_skip) {
        step = this.step(step.next);
      }
      var from = params.from || null;
      var is_back = params.is_back || false;
      if (from) {
        step.from = from;
      }
      this.render(step);
      this._current_step = step.name;
      if (this.steps_past.indexOf(step.name) < 0) {
        this.steps_past.push(step.name);
      }
      this.updateProgress();
      return this;
    }
  }, {
    key: 'collectData',
    value: function collectData() {
      var data = {};
      for (var step in this.steps) {
        if (this.step(step).data) {
          data[step] = this.step(step).data;
        }
      }
      return data;
    }
  }, {
    key: 'init',
    value: function init(first_step) {
      this.first_step = first_step;
      this.commonHandlers();
      this._current_step = this.first_step;
      this.goToStep(this.step(this._current_step));
    }
  }, {
    key: 'current_step',
    get: function get() {
      return this.step(this._current_step) || null;
    }
  }, {
    key: 'container',
    get: function get() {
      return this._container;
    }
  }, {
    key: 'steps',
    get: function get() {
      return this._steps;
    }
  }, {
    key: 'all_data',
    get: function get() {
      return this.collectData();
    }
  }]);

  return StepSystem;
}();

},{}],3:[function(require,module,exports){
'use strict';

var _Step = require('../classes/Step');

var _StepSystem = require('../classes/StepSystem');

window.app = new _StepSystem.StepSystem({
  container: $('.container'),
  step_class: '.step'
});

(function (app) {
  var _this = this;

  var first_step = 'first-step';

  app
  /**
   * COMMON HANDLERS
   */
  .setHandlers(function () {
    console.log('handlers init');
  })

  /**
   * FIRST STEP
   */
  .addStep(new _Step.Step({
    name: 'first-step',
    next: 'second-step',
    methods: {
      beforeRender: function beforeRender(step) {
        console.log('first-step beforeRender');
        return { status: true };
      },
      beforeNext: function beforeNext(step) {
        console.log('first-step beforeNext', _this);
        step.data.lol = 'lol';
        return { status: true };
      },
      onRender: function onRender(step) {
        app.container.find('.step').css({ 'color': 'green' });
      }
    }
  }))

  /**
   * SECOND STEP
   */
  .addStep(new _Step.Step({
    name: 'second-step',
    next: 'third-step',
    methods: {
      isSkip: function isSkip(step) {
        return app.step('first-step').data.lol == 'lol';
      },
      beforeRender: function beforeRender(step) {
        console.log('second-step beforeRender');
        return { status: true };
      },
      beforeNext: function beforeNext(step) {
        console.log('second-step beforeNext');
        step.data.azaza = 'azaza';
        return { status: true };
      },
      onRender: function onRender(step) {
        app.container.find('.step').css({ 'color': 'red' });
      }
    }
  }))

  /**
   * THIRD STEP
   */
  .addStep(new _Step.Step({
    name: 'third-step',
    methods: {
      beforeRender: function beforeRender(step) {
        console.log('third-step beforeRender');
        return { status: true };
      },
      beforeNext: function beforeNext(step) {
        console.log('third-step beforeNext');
        step.data.kek = 'kek';
        return { status: true };
      },
      onRender: function onRender(step) {
        app.container.find('.step').css({ 'color': 'blue' });
      }
    }
  }))

  /**
   * FINISH
   */
  .addStep(new _Step.Step({
    name: 'finish',
    hide_progress: true,
    ignore_progress: true,
    methods: {
      beforeRender: function beforeRender(step) {
        console.log('finish beforeRender');
        return { status: true };
      },
      beforeNext: function beforeNext(step) {
        console.log('finish beforeNext');
        step.data.kek = 'kek';
        return { status: true };
      },
      onRender: function onRender(step) {}
    }
  }));

  /**
   * GLOBAL
   */

  app.onFinish = function () {
    app.goToStep(app.step('finish'));
    console.log(app.collectData());
  };

  app.onProgress = function (progress) {
    app.container.find('.progress').html(Math.floor(progress) + '%');
  };

  app.onStepRender = function (step) {
    app.container.find('.step .next').click(function () {
      app.goNext();
    });
    app.container.find('.step .back').click(function () {
      app.goBack();
    });

    console.log(step);

    if (step.hide_progress) {
      app.container.find('.progress').hide();
    } else {
      app.container.find('.progress').show();
    }
  };

  app.init(first_step);
})(window.app);

},{"../classes/Step":1,"../classes/StepSystem":2}]},{},[3])

//# sourceMappingURL=app.js.map
