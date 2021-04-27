import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableOpacity,
  Platform,
  Text,
  AsyncStorage,
  ActivityIndicator,
  FlatList,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { Icon, Input } from "react-native-elements";
import NavigatorService from "../../router/NavigatorService";
import Orientation from "react-native-orientation";
import MainButton from "../../components/MainButton";
import Header from "../../components/Header";
import CenterLoading from "../../components/CenterLoading";
import {normalize} from '../Forms/MoneyTransfer/MoneyTransferComponent'


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      keyboardOpen: false,
      boxDimension: 0,
      Beneficiaryname:'',
      settingsLoading: false,
      modalOpen: false,
      moneyTransferPageType:'Money Transfer',
      moneyTrasferPageEditable:false,
      editDetails:false
    };
  }
  componentDidMount() {
    Orientation.lockToPortrait();
    
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
    const { boxDimension, showPassword } = this.state;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#ffffff"
        }}
      >
       <View style={{ width: "100%", height:normalize(43)}}>
          <Header
            iconName={"arrow-left"}
            //showIcon={!this.state.settingsLoading}
            iconType="material-community"
            iconColor={"#fff"}
            //iconSize={32}
            onIconPress={() => {
              NavigatorService.reset('HomeScreen');
            }}
          
            titleColor={"#ffff"}
            backgroundColor={this.props.theme.headerColor}
            // titleLabel={
            //   this.state.pageDepth.length == 0
            //     ? "HOME"
            //     : this.state.pageDepth.length == 1
            //     ? "CATEGORIES"
            //     : "SUB - CATEGORIES"
            // }
            titleLabel={"Profile Details"}
            rightIconName={this.state.editDetails?'check-square':"edit"}
            rightIconType={"feather"}
            rightIconColor={"#fff"}
            rightIconMarginRight={5}
            rightIconMarginLeft={5}
            rightOnIconPress={() => {
              this.setState({ editDetails: !this.state.editDetails },()=>{
                if(this.state.editDetails)
                {
                  //this._nameref.focus()
                  
                }
                
              });
            }}
          />
        </View>
        
            
        <View
            style={{ flex:9,width:'100%'}}
          >
        <View style={{height:140,width:'100%',alignItems:'center',justifyContent:'flex-start',flexDirection:'row',paddingLeft:20}}>  
            <View style={{backgroundColor:'#6897ca',height:80,width:80,borderRadius:40,justifyContent:'center',alignItems:'center',paddingBottom:10}}>
            <Icon
                color="#fff"
                size={60}
                type="material-community"
                underlayColor="rgba(255,255,255,0)"
                name={'account'}
                //name={'eye'}
               
              />
        </View>
        <View style={{paddingLeft:20,overflow:'hidden'}}>
          <Text style={{fontSize:22,marginVertical:2}}>Account Balance</Text>
          <View style={{flexDirection:'row'}}>
          <Icon
                color="#151515"
                size={24}
                type="font-awesome"
                underlayColor="rgba(255,255,255,0)"
                name={'rupee'}
                containerStyle={{marginTop:6,marginRight:10}}
               
              />
          <Text numberOfLines={1} style={{fontSize:24,width:200,color:'#151515'}}>120000</Text>
          </View>
          
        </View>
       
        </View>
    <View style={{flex:9}}>
              <ScrollView 
        
        ref={ref => this.scrollView = ref}
    // onContentSizeChange={(contentWidth, contentHeight)=>{        
    //     this.scrollView.scrollResponderScrollToEnd({animated: true});
    // }}
        
        style={{}} contentContainerStyle={{alignItems:'center',paddingTop:5,paddingBottom:20}}>
        
        <Input
        disabled={!this.state.editDetails}
          ref={ref=>this._nameref=ref}
              autoCapitalize={"none"}
              inputContainerStyle={{
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 3,
                borderColor: "#c0c0c8",
                marginLeft:1
              }}
              containerStyle={{
                width: "95%",
                paddingHorizontal: 0
              }}
              autoCorrect={false}
              // keyboardType={'email-address'}
              label={"Name"}
              labelStyle={{ color: "#002b36", fontSize: 14, marginBottom: 10 ,marginLeft:0}}
              placeholderTextColor={"grey"}
              placeholder={"User Name"}
              value={this.state.userName}
              autoCompleteType={'name'}
              onChangeText={text => this.setState({ userName: text })}
              maxLength={30}
            />
            <Input
            disabled={!this.state.editDetails}
              autoCapitalize={"none"}
              inputContainerStyle={{
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 3,
                borderColor: "#c0c0c8",
                marginLeft:1
              }}
              containerStyle={{
                width: "95%",
                paddingHorizontal: 0,
                marginTop:20
              }}
              autoCorrect={false}
               keyboardType={'numeric'}
              label={"Home / Company"}
              labelStyle={{ color: "#002b36", fontSize: 14, marginBottom: 10 ,marginLeft:0}}
              placeholderTextColor={"grey"}
              placeholder={"Home / Company"}
              value={this.state.company}
              autoCompleteType={'tel'}
              maxLength={10}
              onChangeText={text => this.setState({ company: text })}
              
            />
            
            <Input
            disabled={!this.state.editDetails}
              autoCapitalize={"none"}
              inputContainerStyle={{
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 3,
                borderColor: "#c0c0c8",
                marginLeft:1
              }}
              containerStyle={{
                width: "95%",
                paddingHorizontal: 0,
                marginTop:20
              }}
              autoCorrect={false}
              // keyboardType={'email-address'}
              label={"Place/Nearby"}
              labelStyle={{ color: "#002b36", fontSize: 14, marginBottom: 10 ,marginLeft:0}}
              placeholderTextColor={"grey"}
              placeholder={"Place / Nearby"}
              value={this.state.place}
              
              onChangeText={text => this.setState({ place: text })}
              
            />
            
            <Input
            disabled={!this.state.editDetails}
              autoCapitalize={"none"}
              inputContainerStyle={{
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 3,
                borderColor: "#c0c0c8",
                marginLeft:1
              }}
              containerStyle={{
                width: "95%",
                paddingHorizontal: 0,
                marginTop:20
              }}
              autoCorrect={false}
              // keyboardType={'email-address'}
              label={"Post Office"}
              labelStyle={{ color: "#002b36", fontSize: 14, marginBottom: 10 ,marginLeft:0}}
              placeholderTextColor={"grey"}
              placeholder={"Post Office"}
              value={this.state.postoffice}
              
              onChangeText={text => this.setState({ postoffice: text })}
              
            />
           
            <Input
            disabled={!this.state.editDetails}
              autoCapitalize={"none"}
              inputContainerStyle={{
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 3,
                borderColor: "#c0c0c8",
                marginLeft:1
              }}
              containerStyle={{
                width: "95%",
                paddingHorizontal: 0,
                marginTop:20
              }}
              autoCorrect={false}
              // keyboardType={'email-address'}
              label={"District"}
              labelStyle={{ color: "#002b36", fontSize: 14, marginBottom: 10 ,marginLeft:0}}
              placeholderTextColor={"grey"}
              placeholder={"District"}
              value={this.state.district}
              
              onChangeText={text => this.setState({ district: text })}
              
            />
            <Input
            disabled={!this.state.editDetails}
              autoCapitalize={"none"}
              inputContainerStyle={{
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 3,
                borderColor: "#c0c0c8",
                marginLeft:1
              }}
              containerStyle={{
                width: "95%",
                paddingHorizontal: 0,
                marginTop:20
              }}
              autoCorrect={false}
              // keyboardType={'email-address'}
              label={"Center Name"}
              labelStyle={{ color: "#002b36", fontSize: 14, marginBottom: 10 ,marginLeft:0}}
              placeholderTextColor={"grey"}
              placeholder={"Center Name"}
              value={this.state.centerName}
              
              onChangeText={text => this.setState({ centerName: text })}
              
            />
            <Input
            disabled={!this.state.editDetails}
              autoCapitalize={"none"}
              inputContainerStyle={{
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 3,
                borderColor: "#c0c0c8",
                marginLeft:1
              }}
              containerStyle={{
                width: "95%",
                paddingHorizontal: 0,
                marginTop:20
              }}
              autoCorrect={false}
             keyboardType={'numeric'}
              label={"PinCode"}
              labelStyle={{ color: "#002b36", fontSize: 14, marginBottom: 10 ,marginLeft:0}}
              placeholderTextColor={"grey"}
              placeholder={"Pin code"}
              value={this.state.pincode}
              
              onChangeText={text => this.setState({ pincode: text })}
              
            />
            <Input
            disabled={!this.state.editDetails}
              autoCapitalize={"none"}
              inputContainerStyle={{
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 3,
                borderColor: "#c0c0c8",
                marginLeft:1
              }}
              containerStyle={{
                width: "95%",
                paddingHorizontal: 0,
                marginTop:20
              }}
              autoCorrect={false}
              keyboardType={'numeric'}
              maxLength={10}
              label={"Mobile Number"}
              labelStyle={{ color: "#002b36", fontSize: 14, marginBottom: 10 ,marginLeft:0}}
              placeholderTextColor={"grey"}
              placeholder={"Mobile Number"}
              value={this.state.mobileNumber}
              
              onChangeText={text => this.setState({ mobileNumber: text })}
              
            />
            <Input
            disabled={!this.state.editDetails}
              autoCapitalize={"none"}
              inputContainerStyle={{
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 3,
                borderColor: "#c0c0c8",
                marginLeft:1
              }}
              containerStyle={{
                width: "95%",
                paddingHorizontal: 0,
                marginTop:20
              }}
              autoCorrect={false}
              // keyboardType={'email-address'}
              label={"Email Id"}
              labelStyle={{ color: "#002b36", fontSize: 14, marginBottom: 10 ,marginLeft:0}}
              placeholderTextColor={"grey"}
              placeholder={"Email address"}
              value={this.state.emailId}
              
              onChangeText={text => this.setState({ emailId: text })}
              
            />
            
            
            </ScrollView>
            </View>
            </View>
        
            {/* <View
            style={{ paddingTop:12,height:normalize(90),width:'100%',position:'absolute',top:490,alignItems:'center',justifyContent:'center'}}
          >
        <MainButton
              activityIndicatorShow={this.state.settingsLoading}
             
              buttonWidth={"95%"}
              buttonColor={this.props.theme.buttonColor}
              buttonHeight={ "72%"}
              fontSize={18}
              buttonTitle={"Transfer"}
              textColor={"#ffff"}
              onButtonPress={() => {
                Keyboard.dismiss();
                this.setState({ settingsLoading: true }, () => {
                  login({
                    username: this.state.username,
                    password: this.state.password
                  })
                    .then(result => {
                      this.setState({ settingsLoading: false });

                      if (result.data && result.data.response == true && result.data.token && result.data.token!=='') {
                        AsyncStorage.setItem('refresh_token',result.data.token)
                        NavigatorService.reset("HomeScreen");
                      } else {
                        alert("Incorrect username/password");
                      }
                    })
                    .catch(err => {
                      this.setState({settingsLoading:false},()=>{
                        alert("Incorrect username/password");
                      })
                    
                      console.log("Error", err.response);
                    });
                });
              }}
            ></MainButton>

        </View>  */}
        
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  authorization: state.authorization,
  theme: state.theme
});

export default connect(mapStateToProps)(Profile);
