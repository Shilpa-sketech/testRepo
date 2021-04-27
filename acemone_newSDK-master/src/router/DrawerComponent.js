import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableOpacity,
  Platform,
  Text,
  FlatList
} from "react-native";

import {Icon} from 'react-native-elements'

export default class DrawerComponent extends React.Component {
    navigateTo = (path) => {
        this.props.navigation.navigate(path)
    }
    render(){
      return(
        <View style={{flex:1}}>            
          <View style={{flex:1}}>
              <View style={{height:'100%',backgroundColor:'red',alignItems:'center'}}>
                <View
          style={{
            width: '90%',
            marginVertical: 5,
            paddingTop:20
          }}
        >
          <Image source={require('../images/logo.jpeg')} style={{ alignSelf:'center',height: 56, width: 56, borderRadius: 28 }} />
          <Text
            style={{
              paddingTop: 10,
              color: 'black',
              fontSize: 20,
              fontWeight: '500',
              paddingVertical: 0.5,
            }}
          >
            displayName
          </Text>
          <TouchableOpacity
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginVertical: 5,
            }}
            onPress={() => {
             // NavigatorService.navigate('MyProfileScreen');
            }}
          >
            <Text
              style={{
                color: '#222222',
                fontSize: 15,
                fontWeight: '400',
                paddingVertical: 0.5,
              }}
            >
              My Profile
            </Text>
            <Icon
              name="ios-arrow-forward"
              type="ionicon"
              color={'grey'}
              onPress={() => {
               // NavigatorService.navigate('MyProfileScreen');
              }}
            />
          </TouchableOpacity>
        </View>




              </View>
            {/* <Item path='MyAccount' navigate = {this.navigateTo}/>
            <Item path='ContactUs' navigate = {this.navigateTo}/>
            <Item path='InviteFriend' navigate = {this.navigateTo}/>
            //And you add all the item you need here with navigateTo function */}
          </View>
          <View>
            
          </View>
        </View>
      )
    }
  }