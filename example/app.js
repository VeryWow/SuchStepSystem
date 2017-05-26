import { Step } from '../classes/Step'
import { StepSystem } from '../classes/StepSystem'

window.app = new StepSystem({
  container: $('.container'),
  step_class: '.step'
});

(function (app) {

  const first_step = 'first-step'

  app
  /**
   * COMMON HANDLERS
   */
  .setHandlers(() => {
    console.log('handlers init')

  })
  
  /**
   * FIRST STEP
   */
  .addStep(new Step({
    name: 'first-step',
    next: 'second-step',
    methods: {
      beforeRender: (step) => {
        console.log('first-step beforeRender')
        return { status: true }
      },
      beforeNext: (step) => {
        console.log('first-step beforeNext', this)
        step.data.lol = 'lol'
        return { status: true }
      },
      onRender: (step) => {
        app.container.find('.step').css({'color': 'green'})
      }
    }
  }))

  /**
   * SECOND STEP
   */
  .addStep(new Step({
    name: 'second-step',
    next: 'third-step',
    methods: {
      isSkip: (step) => {
        return app.step('first-step').data.lol == 'lol'
      },
      beforeRender: (step) => {
        console.log('second-step beforeRender')
        return { status: true }
      },
      beforeNext: (step) => {
        console.log('second-step beforeNext')
        step.data.azaza = 'azaza'
        return { status: true }
      },
      onRender: (step) => {
        app.container.find('.step').css({'color': 'red'})
      }
    }
  }))

  /**
   * THIRD STEP
   */
  .addStep(new Step({
    name: 'third-step',
    methods: {
      beforeRender: (step) => {
        console.log('third-step beforeRender')
        return { status: true }
      },
      beforeNext: (step) => {
        console.log('third-step beforeNext')
        step.data.kek = 'kek'
        return { status: true }
      },
      onRender: (step) => {
        app.container.find('.step').css({'color': 'blue'})
      }
    }
  }))

  /**
   * FINISH
   */
  .addStep(new Step({
    name: 'finish',
    hide_progress: true,
    ignore_progress: true,
    methods: {
      beforeRender: (step) => {
        console.log('finish beforeRender')
        return { status: true }
      },
      beforeNext: (step) => {
        console.log('finish beforeNext')
        step.data.kek = 'kek'
        return { status: true }
      },
      onRender: (step) => { }
    }
  }))

  /**
   * GLOBAL
   */

  app.onFinish = () => {
    app.goToStep(app.step('finish'))
    console.log(app.collectData())
  }

  app.onProgress = (progress) => {
    app.container.find('.progress').html(Math.floor(progress) + '%')
  }

  app.onStepRender = (step) => {
    app.container.find('.step .next').click(function () {
      app.goNext()
    })
    app.container.find('.step .back').click(function () {
      app.goBack()
    })

    console.log(step)

    if (step.hide_progress) {
      app.container.find('.progress').hide()
    } else {
      app.container.find('.progress').show()
    }
  }

  app.init(first_step)

})(window.app)
