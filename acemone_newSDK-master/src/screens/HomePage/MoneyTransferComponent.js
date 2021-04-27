import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableOpacity,
  Platform,
  Text,
  FlatList,
  Dimensions,
  PixelRatio,
  ActivityIndicator,StyleSheet
} from "react-native";
import { connect } from "react-redux";
import { Icon, Input } from "react-native-elements";
import NavigatorService from "../../router/NavigatorService";

import MainButton from "../../components/MainButton";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

class MoneyTransferComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      keyboardOpen: false,
      boxDimension: 0,
      username: "",
      mpinpassword: ""
    };
  }
  componentDidMount() {
    

    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
      this.setState({ keyboardOpen: true })
    );
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
      this.setState({ keyboardOpen: false })
    );
  }

  componentWillUnmount() {
    //Orientation.unlockAllOrientations();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    let { data, dataLength, max_datalength, page_Depth } = this.props;
    const { boxDimension, showPassword } = this.state;

    return (
      <TouchableOpacity
        disabled={this.props.disableClick}
        onPress={() => this.props.onClickFunction()}
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 10,
         
          
         
          width: "96%",
          backgroundColor: "#fff",
          alignSelf: "center",
          borderWidth: StyleSheet.hairlineWidth,
          flexDirection: "row",
          //borderBottomWidth:this.props.borderBottom,
          borderColor: '#c0c0c8',
         
          borderRadius: 5,
          shadowColor: "#000",
          shadowOffset: {
            width: 2,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 2,
          elevation: 2
          
        }}
      >
        <View style={{ flex: 16 , padding: 10,}}>
          <View
            style={{  flexDirection: "row", backgroundColor: "transparent" ,paddingVertical:4}}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              
              <View style={{ flex: 9 ,overflow:'hidden'}}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 25, fontWeight: "bold" ,color:'#54565A'}}>
                  {data.name?data.name:''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{  flexDirection: "row", backgroundColor: "transparent",paddingVertical:3,paddingRight:3 }}
          >
            <View
              style={{ flex: 1, alignItems: "flex-start" }}
            >
              <View style={{ flex: 5,overflow:'hidden' }}>
                <Text numberOfLines={1} ellipsizeMode={'tail'}  style={{alignSelf:'flex-start',color:'#7B8899', fontWeight: "bold"}}>Acc no :</Text>
              </View>
              <View style={{ flex: 9 ,overflow:'hidden'}}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 16, fontWeight: "bold" ,color:'#54565A'}}>
                  {data.account_no?data.account_no:''}
                </Text>
              </View>
            </View>
            <View
              style={{ flex: 1,  alignItems: "flex-start" }}
            >
              <View style={{ flex: 5,overflow:'hidden' }}>
                <Text numberOfLines={1} ellipsizeMode={'tail'}  style={{alignSelf:'flex-start',color:'#7B8899', fontWeight: "bold"}}>IFSC Code :</Text>
              </View>
              <View style={{ flex: 9 ,overflow:'hidden'}}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 16, fontWeight: "bold" ,color:'#54565A'}}>
                  {data.ifsc?data.ifsc:''}
                </Text>
              </View>
            </View>
          </View>
          {/* <View
            style={{ flex: 1, flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5,overflow:'hidden' }}>
                <Text numberOfLines={1} ellipsizeMode={'tail'}  style={{alignSelf:'flex-start',color:'#2E2E2E'}}>IFSC Code :</Text>
              </View>
              <View style={{ flex: 9 ,overflow:'hidden'}}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 16, fontWeight: "800" ,color:'#2A0A12'}}>
                  {data.ifsc?data.ifsc:''}
                </Text>
              </View>
            </View>
          </View> */}

          <View
            style={{  flexDirection: "row", backgroundColor: "transparent" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
             <View style={{ flex: 1 ,overflow:'hidden',flexDirection: "row",}}>
             <View style={{ overflow:'hidden',alignItems:'center',maxWidth:'40%',justifyContent:'center',padding:2}}>
                <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ fontSize: 16, fontWeight: "bold" ,color:'#54565A' }}>
                  {data.bank_name?data.bank_name:''}
                </Text>
                </View>
                <View style={{ overflow:'hidden',alignItems:'center',justifyContent:'center',padding:2}}>
                <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ fontSize: 16, fontWeight: "bold" ,color:'#54565A' }}>
                  {'  -  '}
                </Text>
                </View>
                <View style={{ overflow:'hidden',alignItems:'center',maxWidth:'40%',justifyContent:'center',padding:2}}>
                <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ fontSize: 16, fontWeight: "bold" ,color:'#54565A' }}>
                  {data.bank_branch?data.bank_branch:''}
                </Text>
                </View>
              </View>
             
            </View>
          </View>
          {/* <View
            style={{ flex: 1, flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5,overflow:'hidden' }}>
                <Text numberOfLines={1} ellipsizeMode={'tail'}  style={{alignSelf:'flex-start',color:'#2E2E2E'}}>Bank :</Text>
              </View>
              <View style={{ flex: 9 ,overflow:'hidden'}}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 16, fontWeight: "800" ,color:'#2A0A12' }}>
                  {data.bank_name?data.bank_name:''}
                </Text>
              </View>
            </View>
          </View> */}
        </View>
        <View
          style={{
            flex: 2,
            borderTopRightRadius:5,
            borderBottomRightRadius:5,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
            "transparent"
              
          }}
        >
          
          {this.props.disableClick && data.id!==this.props.deleteLoaderId && (
            <TouchableOpacity
              style={{
                flex: 0.5,
                justifyContent: "center",
                alignItems: "center"
              }}
              disabled={this.props.deleteLoaderId!==''}
              onPress={() => this.props.deleteItemFunction()}
            >
              <Icon
                color="#528FF3"
                size={20}
                type="material-community"
                underlayColor="rgba(255,255,255,0)"
                name={"delete"}
                //name={'eye'}
                
              />
            </TouchableOpacity>
          )}
          {this.props.disableClick && data.id==this.props.deleteLoaderId && ( <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
            
          >
            <ActivityIndicator size={'small'} color={'#528FF3'}/>
          </View>)}
          {this.props.disableClick && (
            <TouchableOpacity
              style={{
                flex: 0.5,
                justifyContent: "center",
                alignItems: "center",
              }}
              disabled={this.props.deleteLoaderId!==''}
              onPress={() => this.props.editFunction()}
            >
              <Icon
                color="#528FF3"
                size={20}
                type="materialicons"
                underlayColor="rgba(255,255,255,0)"
                name={"edit"}
                //name={'eye'}
               
              />
            </TouchableOpacity>
          )}
          {this.props.disableClick && (
            <View style={{flex:1}}/>
          )}
          {/* {this.props.disableClick==false && (
            <TouchableOpacity

              disabled={true}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
             // onPress={() => NavigatorService.navigate('AddEditBeneficiaryScreen',{data:this.props.data,mode:'edit'})}
            >
              <Icon
                color="#fff"
                size={30}
                type="materialicons"
                underlayColor="rgba(255,255,255,0)"
                name={"keyboard-arrow-right"}
                //name={'eye'}
               
              />
            </TouchableOpacity>
          )} */}
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  authorization: state.authorization
});

export default connect(mapStateToProps)(MoneyTransferComponent);
