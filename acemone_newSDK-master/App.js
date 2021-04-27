import React, {Component} from 'react';

import {Provider} from 'react-redux';
import {View, Image} from 'react-native';
import store from './src/store';
import Router from './src/router';
import NavigatorService from './src/router/NavigatorService';

type Props = {};
export default class App extends Component<Props> {
  render() {
    console.disableYellowBox = true;
    return (
      
      <Provider store={store}>

        <Router
          onNavigationStateChange={null}
          ref={navigatorRef => {
            NavigatorService.setContainer(navigatorRef);
          }}
        />

      </Provider>
    );
  }
}
