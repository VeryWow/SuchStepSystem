import { Step } from '../classes/Step'
import { StepSystem } from '../classes/StepSystem'

window.app = new StepSystem($('.container'));

(function (app) {

  const first_step = 'first-step'

  app
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
        console.log('first-step beforeNext')
        return { status: true }
      }
    }
  }))

  /**
   * SECOND STEP
   */
  .addStep(new Step({
    name: 'second-step',
    methods: {
      beforeRender: () => {
        console.log('second-step beforeRender')
        return { status: true }
      },
      beforeNext: () => {
        console.log('second-step beforeNext')
        return { status: true }
      }
    }
  }))

  app.init(first_step)

})(window.app)
