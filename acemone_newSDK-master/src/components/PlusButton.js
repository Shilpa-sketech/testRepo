import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

export default class PlusButton extends Component {
  render() {
    const { iconName, iconType, iconSize, iconColor, onPress, backgroundColor,disabled } = this.props;
    return (
      <TouchableOpacity
        disabled={disabled?disabled:false}
        style={{
          backgroundColor: backgroundColor ? backgroundColor : '#000000',
          position: 'absolute',
          bottom: 30,
          right: 16,
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          zIndex:2000
        }}
        onPress={() => {
          if (onPress) {
            onPress();
          }
        }}
      >
        <Icon
          name={iconName ? iconName : 'user-plus'}
          type={iconType ? iconType : 'feather'}
          size={iconSize ? iconSize : 26}
          color={iconColor ? iconColor : '#ffffff'}
          style={{alignSelf:'center',paddingBottom:1.5,paddingRight:.3}}
        />
      </TouchableOpacity>
    );
  }
}
