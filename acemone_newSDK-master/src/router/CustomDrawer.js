import React, { Component } from 'react';
import { SafeAreaView,View, Text, Image, ScrollView, TouchableOpacity,Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
//import { DrawerItems } from 'react-navigation-stack';
import {DrawerItems} from 'react-navigation-drawer'
import { Icon } from 'react-native-elements';
import NavigatorService from '../router/NavigatorService';
//import { translate } from '../i18';
import store from '../store';
import {wsClose} from '../utils/webSocket'
class CustomDrawer extends Component {
  constructor(props) {
    super(props);
    // let { profile_pic } = this.props.userDetails;
    // if (profile_pic) {
    //   profile_pic = { uri: profile_pic };
    // } else {
    //   profile_pic = require('../images/flower.png');
    // }
    this.state = {
      src: '',
      props: {},
      newProps: {},
    };
  }

//   componentWillReceiveProps(props) {
//     console.log(props.home, this.props, 'homes');
//   }

  render() {
    // let displayName = this.getDisplayNameFromUserDetails(this.props.userDetails);
     const { items, ...rest } = this.props;
    // const home = this.props.home ? this.props.home : {};
    // let objects = [];
    // if (home.notes == false) {
    //   objects.push('NoteList');
    // }
    // if (home.connected_device == false) {
    //   objects.push('Connectdevice');
    // }

    // if (home.treatment == false) {
    //   objects.push('Treatment');
    // }
    // if (home.extensions == false) {
    //   objects.push('Extensions');
    // }
    // if (home.files == false) {
    //   objects.push('FileUploadScreen');
    // }
    // console.log(home, 'popoye');
    // //const filteredItems = items.filter(item => item.key !== objects[0]);
    // let filteredItems = [];
    // items.map(function(item) {
    //   let flag = 0;
    //   if (item.key == 'NoteList') {
    //     objects.map(function(value) {
    //       if (value == 'NoteList') {
    //         flag = 1;
    //       }
    //     });
    //   }
    //   if (item.key == 'Extensions') {
    //     objects.map(function(value) {
    //       if (value == 'Extensions') {
    //         flag = 1;
    //       }
    //     });
    //   }
    //   if (item.key == 'Connectdevice') {
    //     objects.map(function(value) {
    //       if (value == 'Connectdevice') {
    //         flag = 1;
    //       }
    //     });
    //   }
    //   if (item.key == 'FileUploadScreen') {
    //     objects.map(function(value) {
    //       if (value == 'FileUploadScreen') {
    //         flag = 1;
    //       }
    //     });
    //   }
    //   if (item.key == 'Treatment') {
    //     objects.map(function(value) {
    //       if (value == 'Treatment') {
    //         flag = 1;
    //       }
    //     });
    //   }
    //   if (flag == 0) {
    //     filteredItems.push(item);
    //   }
    // });

    let filteredItems = [];
    items.map(function(item) {
      if(item.key=='AdminPanelScreen'
       && store.getState().login.userDetails && store.getState().login.userDetails.type && store.getState().login.userDetails.type=='agent'
        )
      {
        filteredItems.push(item)
      }
      else if(item.key !='AdminPanelScreen'){
        filteredItems.push(item)
      }
    })
    //console.log(this.props)
    return (
      
       <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
         <View style={{flex:3,backgroundColor:'#000000b0',alignItems:'center',justifyContent:'center',paddingTop:5}}>
          <Image  style={{height:100,width:100}} resizeMode={'contain'} source={require('../images/logo.jpeg')}/>
         </View>
         <View style={{flex:6,backgroundColor:'#000000b0'}}>
           <ScrollView showsVerticalScrollIndicator={false}>
           <DrawerItems
                // {...this.props}
                items={filteredItems}
                {...rest}
                activeTintColor="#000"
                itemStyle={{ width: '100%' ,
               //backgroundColor:'#2D8AE934',
               backgroundColor:'#00000020',
                height:55,}}
                itemsContainerStyle={{ width: '100%', }}
                labelStyle={{color:'#fff',fontWeight: '400', fontSize: 18, }}
              />
              
           
           
           </ScrollView>
          

         </View>
         <View style={{flex:1,justifyContent:'flex-end',alignItems:'center',paddingBottom:25,backgroundColor:'#000000b0'}}>
           <TouchableOpacity style={{height:50,width:70}} onPress={()=>{
             Alert.alert(
              '',
              'Do you want to logout?',
              [
                
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () =>  
                {
                  AsyncStorage.setItem('refresh_token','xxxx').then(result=>{
                    wsClose()
                    NavigatorService.reset('LoginMainScreen')
                  })
                    
               
                }},
              ],
              { cancelable: false }
            )
            
           }}>
             <View style={{flex:2,alignItems:'center',justifyContent:'center',marginTop:3}}>
             <Icon style={{alignSelf:'center'}} size={24} name={'power'} type={'feather'} color={'#fff'}/>
             </View>
             <View style={{alignItems:'center'}}>
             <Text style={{fontWeight:'400',fontSize:18,color:"#ffff"}}>Logout</Text>
             </View>
             </TouchableOpacity>
           </View>
       </SafeAreaView>
       
     
    );
  }
}

//   getDisplayNameFromUserDetails = userDetails => {
//     console.log('getDisplayNameFromUserDetails', userDetails);
//     let name = '';
//     if (userDetails.first_name) {
//       name = userDetails.first_name;
//       if (userDetails.last_name) {
//         name = name + ' ' + userDetails.last_name;
//       }
//     } else if (userDetails.user) {
//       name = userDetails.user;
//     } else if (userDetails.user_name) {
//       name = userDetails.user_name;
//     } else {
//       name = '';
//     }
//     return name;
//   };
// }

const mapStateToProps = state => ({
    authorization: state.authorization,
  });

export default connect(mapStateToProps)(CustomDrawer);
