import React, { Component } from 'react';
import { View, Animated, Easing ,ActivityIndicator} from 'react-native';
import {  BarIndicator,PulseIndicator ,DotIndicator, BallIndicator, WaveIndicator, SkypeIndicator, UIActivityIndicator } from 'react-native-indicators';
export default class CenterLoading extends Component {
  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
  
  }

  render() {
     const { color } = this.props;
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500,
        }}
      >
        {/* <Animated.Image
          style={{ height: 32, width: 32, transform: [{ rotate: spin }] }}
          source={require('../images/loading.png')}
        /> */}
        {this.props.animating &&(
        < WaveIndicator  size={150} color={'#FF408160'} animating={this.props.animating} hidesWhenStopped={true}/>
        )}
      </View>
    );
  }
}
