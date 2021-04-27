import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityBase,
  Image,
  StyleSheet,
  
} from "react-native";
import { Icon } from "react-native-elements";

const TAG = "THIS_IS_HEADER_DEBUG : ";
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
      middleIconName,
      middleIconType,
      middleIconColor,
      middleOnIconPress,
      optionalIconName,
      optionalIconType,
      optionalIconColor,
      optionalOnIconPress,
      backgroundColor,
      rightIconMarginRight,
      titleAlignItems,
      titleHeaderMarginLeft,
    } = this.props;
    let headerFlex =
      9 -
      (leftIconName ? 1 : 0) -
      (rightIconName ? 1 : 0) -
      (optionalIconName ? 1 : 0);
    console.log(TAG + "HEADER FLEX: ", headerFlex);
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
         // backgroundColor: backgroundColor ? backgroundColor : "#ffffff",
         backgroundColor:'transparent',
         
          borderTopWidth:0,
           borderTopColor:'#F6FAF9',
          paddingRight:10,
          
          //borderTopWidth:1
        }}
      >
        <View style={{flex:5,alignItems:'center',justifyContent:'center',height:'100%',}}>
          <Image
          style={{width:112,justifyContent:'center',alignItems:'center',marginRight:6,marginTop:3}}
           resizeMode={'contain'}
            source={require("../../images/acelogo2.png")}
          />
        </View>
        <View style={{flex:8,padding:10,justifyContent:'center',alignItems:'center',flexDirection:'row',borderWidth:0,backgroundColor:'#c0c0c820',borderRadius:40}}>
        {iconName ? (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              
              width: "100%",
              justifyContent: "center",
              
            
            }}
            onPress={onIconPress}
          >
           <View style={{
              
             }}>
            <Icon
               size={21.5}
              name={iconName}
              type={iconType}
              //color={iconColor}
              color={'#3575D7'}
              underlayColor="rgba(255,255,255,0)"
            />
            </View>
          </TouchableOpacity>
        ) : null}
        {middleIconName ? (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
             
              width: "100%",
              justifyContent: "center",
             
              
            }}
            
            onPress={middleOnIconPress}
          >
            <View style={{}}>
            <Icon
                 size={21.5}
              name={middleIconName}
              type={middleIconType}
              color={'#3575D7'}
             
              underlayColor="rgba(255,255,255,0)"
            />
            </View>
          </TouchableOpacity>
        ) : null}
        {leftIconName ? (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
             
              width: "100%",
              justifyContent: "center",
              
            }}
            onPress={leftOnIconPress}
          >
            <View style={{}}>
            <Icon
                size={21.5}
              name={leftIconName}
              type={leftIconType}
              color={'#3575D7'}
              underlayColor="rgba(255,255,255,0)"
              
            />
            </View>
          </TouchableOpacity>
        ) : null}
        {rightIconName ? (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
             
              width: "100%",
              justifyContent: "center",
              // marginRight: rightIconMarginRight ? rightIconMarginRight : 0,
             
            }}
            onPress={rightOnIconPress}
          >
          <View style={{}}>
            <Icon
                size={21.5}
              name={rightIconName}
              type={rightIconType}
              color={'#3575D7'}
              underlayColor="rgba(255,255,255,0)"
            />
            </View>
          </TouchableOpacity>
        ) : null}
        </View>
        {/* {optionalIconName ? (
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
        ) : null} */}
        
      </View>
    );
  }
}
