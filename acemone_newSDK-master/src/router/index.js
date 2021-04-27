import React from 'react';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import HomePage from '../screens/HomePage/HomePage';
import Login from '../screens/LoginPage/LoginPassword';
import ForgotPassword from '../screens/ForgotPassword'
import ForgotPasswordOTP from '../screens/ForgotPassword/OtpPasswordPage'
import ForgotPasswordReset from '../screens/ForgotPassword/ResetPassword'
import {Transition} from 'react-native-reanimated';
import {Animated, Easing} from 'react-native';

let SlideFromRight = (index, position, width) => {
  const inputRange = [index - 1, index, index + 1];
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 0, 0],
  });
  const slideFromRight = {transform: [{translateX}]};
  return slideFromRight;
};

//Transition configurations for createStackNavigator
const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const {layout, position, scene} = sceneProps;
      const width = layout.initWidth;
      const {index} = scene;
      return SlideFromRight(index, position, width);
    },
  };
};

const screenList = createStackNavigator(
  {
    LoginScreen: {
      screen: Login,
      navigationOptions: () => ({
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
        cardOverlayEnabled: false,
        cardShadowEnabled: false,
      }),
    },
    HomeScreen: {
      screen: HomePage,

      navigationOptions: () => ({
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
        cardOverlayEnabled: false,
        cardShadowEnabled: false,
      }),
    },
    ForgotPasswordResetScreen: {
      screen: ForgotPasswordReset,

      navigationOptions: () => ({
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
        cardOverlayEnabled: false,
        cardShadowEnabled: false,
      }),
    },
    ForgotPasswordOTPScreen: {
      screen: ForgotPasswordOTP,

      navigationOptions: () => ({
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
        cardOverlayEnabled: false,
        cardShadowEnabled: false,
      }),
    },
    ForgotPasswordScreen: {
      screen: ForgotPassword,
      navigationOptions: () => ({
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
        cardOverlayEnabled: false,
        cardShadowEnabled: false,
      }),
    },
  },
  {
   
    
  },
);

const AppContainer = createAppContainer(screenList);

export default AppContainer;
