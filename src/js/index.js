import 'core-js/es6/promise';
import 'core-js/fn/symbol/for';
import Model from './model';
import Controller from './controller';
import View from './view';
import '../css/main.css';


const model = Model(),
      controller = Controller(),
      view = View(controller);

controller.init({view, model});
