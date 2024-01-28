import {Provider} from 'react-redux';
import {store} from './redux';

import App from './App';

const Index = () => {

  return (
      <Provider store={store}>
        <App/>
      </Provider>
  );
}

export default Index;
