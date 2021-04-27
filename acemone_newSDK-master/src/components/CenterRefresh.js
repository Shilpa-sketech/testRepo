import React, { Component } from "react";
import {
  View,
  Animated,
  Easing,
  ActivityIndicator,
  TouchableWithoutFeedback
} from "react-native";
import { Icon } from "react-native-elements";
export default class CenterRefresh extends Component {
  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
    let animation = Animated.timing(this.spinValue, {
      toValue: 1,
      easing: Easing.linear
    });
    Animated.loop(animation).start();
  }

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });
    let { color, iconPress } = this.props;
    return (
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
          //zIndex: 1500
        }}
      >
        {/* <Animated.Image
          style={{ height: 32, width: 32, transform: [{ rotate: spin }] }}
          source={require('../images/loading.png')}
        /> */}
        <TouchableWithoutFeedback
          style={{
            borderWidth: 1,
            borderColor: color,
            height: 38,
            width: 38,
            borderRadius: 19,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={() => {
            iconPress();
          }}
        >
          <View
            style={{
             // borderWidth: 1,
              borderColor: color,
              height: 38,
              width: 38,
              borderRadius: 19,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon name="ios-refresh" type="ionicon" color={color} size={32} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
