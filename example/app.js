import { Step } from '../classes/Step'
import { StepSystem } from '../classes/StepSystem'

window.app = new StepSystem($('.container'));

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
      beforeRender: () => {
        console.log('first-step beforeRender')
        return { status: true }
      },
      beforeNext: () => {
        console.log('first-step beforeNext', this)
        app.current_step.data.lol = 'lol'
        return { status: true }
      },
      onRender: () => {
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
      beforeRender: () => {
        console.log('second-step beforeRender')
        return { status: true }
      },
      beforeNext: () => {
        console.log('second-step beforeNext')
        app.current_step.data.azaza = 'azaza'
        return { status: true }
      },
      onRender: () => {
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
      beforeRender: () => {
        console.log('third-step beforeRender')
        return { status: true }
      },
      beforeNext: () => {
        console.log('third-step beforeNext')
        app.current_step.data.kek = 'kek'
        return { status: true }
      },
      onRender: () => {
        app.container.find('.step').css({'color': 'blue'})
      }
    }
  }))

  app.onFinish = () => {
    console.log(app.collectData())
  }

  app.init(first_step)

})(window.app)
