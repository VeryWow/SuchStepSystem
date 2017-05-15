import { Step } from '../classes/Step'
import { StepSystem } from '../classes/StepSystem'

window.app = new StepSystem();

(function ($, app) {
  console.log(app)
})(jQuery, window.app)
