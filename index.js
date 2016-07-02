import ReactDom  from 'react-dom';
import { Provider } from 'react-redux';
import App from './container/App';
import configureStore from './store/configureStore';
import Foundation from 'react-foundation';
import './main.scss';
const store = configureStore();

ReactDom.render(
  <Provider store={store}>
    <App  />
  </Provider>,
  document.getElementById('root')
);
