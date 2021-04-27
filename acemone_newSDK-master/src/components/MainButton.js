import React, {Component} from 'react';
import {Animated,TouchableOpacity, View, Text,ActivityIndicator} from 'react-native';

class MainButton extends Component {
  render() {
    const {
      buttonTitle,
      buttonColor,
      onButtonPress,
      textColor,
      buttonWidth,
      disabled,
      fontSize,
      marginVertical,
      borderRadius,
      buttonHeight,
    } = this.props;
    return (
      <TouchableOpacity
        style={{
          marginVertical: marginVertical,
          
        }}
        disabled={disabled ? disabled : false}
        onPress={onButtonPress}>
        <Animated.View
          style={{
            display: 'flex',
            height: buttonHeight ? buttonHeight : '40%',
            width: buttonWidth ? buttonWidth : '100%',
            backgroundColor: disabled
              ? disabled === false
                ? buttonColor
                : 'grey'
              : buttonColor,
            borderRadius:borderRadius?borderRadius:0,
            paddingVertical: 2,
            paddingHorizontal: 5,
            flexDirection: 'row',
            // shadowColor: '#000',
            // shadowOffset: {
            //   width: 0,
            //   height: 1,
            // },
            // shadowOpacity: 0.2,
            // shadowRadius: 1.41,
            // elevation: 2,
            // minHeight: 40,
          }}>
          <View style={{flex: 9, justifyContent: 'space-evenly'}}>
          
           
            {this.props.activityIndicatorShow && this.props.activityIndicatorShow==true ?(
            <ActivityIndicator color={textColor} size="small" />
            ):( <Text
              style={{
                textAlign: 'center',
                color: textColor,
                fontSize: fontSize ? fontSize : 16,
                fontWeight: '500',
              }}>
              {buttonTitle}
            </Text>)}
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

export default MainButton;
