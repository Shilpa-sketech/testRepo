import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const TAG = 'THIS_IS_HEADER_DEBUG : ';
export default class KadoHeader extends Component {
  render() {
    const {
      iconName,
      iconType,
      iconColor,
      onIconPress,
      titleLabel,
      titleColor,
      rightIconName,
      rightIconType,
      rightIconColor,
      rightOnIconPress,
      leftIconName,
      leftIconType,
      leftIconColor,
      leftOnIconPress,
      optionalIconName,
      optionalIconType,
      optionalIconColor,
      optionalOnIconPress,
      backgroundColor,
      rightIconMarginRight,
      titleAlignItems,
      titleHeaderMarginLeft,
      rightIconMarginLeft
    } = this.props;
    let headerFlex =
      9 - (leftIconName ? 1 : 0) - (rightIconName ? 1 : 0) - (optionalIconName ? 1 : 0);
    console.log(TAG + 'HEADER FLEX: ', headerFlex);
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: backgroundColor ? backgroundColor : '#ffffff',
          paddingLeft:1,
          borderBottomWidth:0,
          borderBottomColor:'#A19D9D'
       
         
        }}
      >
        {iconName && iconName !== ' ' ? (
          <TouchableOpacity
            style={{
              flex: 2,
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            
            }}
            onPress={onIconPress}
          >
            <Icon
              name={iconName}
              type={iconType}
              color={iconColor}
              size={28}
              underlayColor="rgba(255,255,255,0)"
            />
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <View
          style={{
            flex: headerFlex,
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginLeft: titleHeaderMarginLeft ? titleHeaderMarginLeft : 0,
            paddingRight:20
          }}
        >
          <Text
            style={{ fontSize: 19, fontWeight: '400', color: titleColor, paddingLeft: 10 }}
            numberOfLines={1}
          >
            {titleLabel}
          </Text>
        </View>
        {leftIconName ? (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              height: '100%',
              width: '100%',
              justifyContent: 'center',
            }}
            onPress={leftOnIconPress}
          >
            <Icon
              name={leftIconName}
              type={leftIconType}
              color={leftIconColor}
              underlayColor="rgba(255,255,255,0)"
            />
          </TouchableOpacity>
        ) : null}
        {rightIconName ? (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              height: '100%',
              width: '100%',
              justifyContent: 'center',
             // marginRight: rightIconMarginRight ? rightIconMarginRight : 0,
             marginRight:10,
              //marginLeft:rightIconMarginLeft ? rightIconMarginLeft : 0
              marginLeft:10
            }}
            onPress={rightOnIconPress}
          >
            <Icon
              name={rightIconName}
              type={rightIconType}
              color={rightIconColor}
              underlayColor="rgba(255,255,255,0)"
            />
          </TouchableOpacity>
        ) : null}
        {optionalIconName ? (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              height: '100%',
              width: '100%',
              justifyContent: 'center',
            }}
            onPress={optionalOnIconPress}
          >
            <Icon
              name={optionalIconName}
              type={optionalIconType}
              color={optionalIconColor}
              underlayColor="rgba(255,255,255,0)"
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}
