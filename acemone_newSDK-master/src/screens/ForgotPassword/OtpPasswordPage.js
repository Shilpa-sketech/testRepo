import React, {Component} from 'react';
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
  Dimensions,
  Animated,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  InteractionManager ,
  ScrollView,
  StyleSheet
} from 'react-native';
import {connect} from 'react-redux';
import {Icon, Input, normalize, Button} from 'react-native-elements';
import NavigatorService from '../../router/NavigatorService';
import AwesomeAlert from 'react-native-awesome-alerts';
import MainButton from '../../components/MainButton';
import Header from '../../components/Header';
import CenterLoading from '../../components/CenterLoading';
import {forgot_password_otpcode} from '../../actions/forms';
import {webSocket} from '../../utils/webSocket';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import {NavigationEvents} from 'react-navigation';
import {
  DotIndicator,
  BallIndicator,
  WaveIndicator,
  UIActivityIndicator,
} from 'react-native-indicators';
import store from '../../store';
//import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const AniamtedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
class ForgotPasswordOTP extends Component {
  IMAGE_HEIGHT = 200;
  IMAGE_HEIGHT_SMALL = 140;
  text_HEIGHT = 40;
  text_HEIGHT_SMALL = 20;

  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      keyboardOpen: false,
      boxDimension: 0,
      username: '',
      password: '',
      settingsLoading: false,
      loginLoading: true,
      showButton: true,
      netInfoChange: false,
      awesomeGeneralAlertShow: false,
      awesomeGeneralAlertMessage: '',
      awesomeErrorAlertShow: false,
      awesomeErrorAlertMessage: '',
      code:''
    };

    this.keyboardHeight = new Animated.Value(0);
    this.imageHeight = new Animated.Value(this.IMAGE_HEIGHT);
    this.textHeight = new Animated.Value(this.text_HEIGHT);
  }
  componentDidMount() {
   
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
    this.setState({keyboardOpen: true}),
  );
  this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
    this.setState({keyboardOpen: false}),
    );
   
  }

  componentWillUnmount() {
    //Orientation.unlockAllOrientations();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

 

  generalAwesomeAlertMessage(message) {
    this.setState(
      {
        awesomeGeneralAlertMessage: message,
      },
      () => {
        this.setState({awesomeGeneralAlertShow: true});
      },
    );
  }

  errorAwesomeAlertMessage(message, func) {
    this.setState(
      {
        awesomeErrorAlertMessage: message,
      },
      () => {
        this.setState({awesomeErrorAlertShow: true});
      },
    );
  }

  render() {
    const {boxDimension, showPassword} = this.state;

      return (
        <View style={{flex: 1, width: '100%', backgroundColor: '#00000090'}}>
        <View
          style={{
            height: normalize(45),
            width: '100%',
            backgroundColor: '#Ffff',
            borderBottomWidth: 0,
            borderTopWidth: 0,
            borderColor: '#c0c0c8',
            flexDirection: 'row',
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Icon
              size={30}
              name={'arrowleft'}
              type={'antdesign'}
              color={'#00000090'}
              underlayColor="rgba(255,255,255,0)"
              onPress={() => {
               NavigatorService.pop()
              }}
            />
          </View>
          <View
            style={{
              flex: 4,
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: 15,
            }}>
            <Text numberOfLines={1} style={{fontSize: 18, color: '#00000090'}}>
            Forgot Password
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              paddingHorizontal: 9,
              paddingVertical: 10,
            }}>
            <MainButton
              activityIndicatorShow={this.state.buttonLoading}
              buttonWidth={'100%'}
              buttonColor={this.props.theme.buttonColor}
              buttonHeight={'100%'}
              fontSize={18}
              buttonTitle={'Submit'}
              borderRadius={8}
              textColor={'#ffff'}
              onButtonPress={() => {
               
            
                  Keyboard.dismiss();
                  
                 
                  this.setState({buttonLoading: true}, () => {
                    if (
                        this.state.code.length==6
                     ) {
                         let otpcode=this.state.code
                        forgot_password_otpcode({
                        agent_email:this.props.navigation.state.params &&this.props.navigation.state.params.agent_email?this.props.navigation.state.params.agent_email:'',
                        otp:this.state.code
                      })
                        .then((result) => {
                          if (result.data && result.data.status == true) {
                            console.log(
                              result.data,
                              'kseb bill payment done successfully',
                            );
                            this.setState(
                              {
                               code:''
                              },
                              () => {
                                NavigatorService.navigate('ForgotPasswordResetScreen',{agent_email:this.props.navigation.state.params &&this.props.navigation.state.params.agent_email?this.props.navigation.state.params.agent_email:''})
                              },
                            );
                          } else if (
                            result.data &&
                            result.data.status == false
                          ) {
                            this.setState({buttonLoading: false});
                            if (
                              result.data.message &&
                              result.data.message !== ''
                            ) {
                              this.errorAwesomeAlertMessage(
                                result.data.message,
                                0,
                              );
                            } else {
                              this.errorAwesomeAlertMessage(
                                'Something went wrong',
                                0,
                              );
                            }
                          }
                          this.setState({buttonLoading: false}, () => {
                            if (
                              result.data &&
                              result.data.status &&
                              result.data.status == true
                            ) {
                              //this.handleBackButtonClick();
                            }
                          });
                        })
                        .catch((err) => {
                          this.setState({buttonLoading: false}, () => {});
                          this.generalAwesomeAlertMessage(
                            'Something went wrong',
                          );
                          console.log('Error', err.response);
                        });
                    } else {
                      this.setState({buttonLoading: false}, () => {
                        // if (kseb_Name == "") {
                        //   alert("Please enter a name");
                        // } else
                       
                          this.generalAwesomeAlertMessage(
                            'Please enter valid OTP code',
                          );
                        
                        
                      });
                    }
                  });

               
              }}
            />
          </View>
        </View>

        <View
          style={{
            flex: 11,
            width: '100%',
            backgroundColor: '#fff',
          }}>
          <ScrollView
            style={{paddingBottom: 20}}
            contentContainerStyle={{
              alignItems: 'center',
              paddingVertical: 20,
              height:'100%',
              width:'100%'
            }}
            ref={(ref) => (this.scrollView = ref)}
            // onContentSizeChange={(contentWidth, contentHeight)=>{
            //     console.log(this.state.locationX,this.state.locationY)
            //     this.scrollView.scrollTo({x: this.state.locationX, y: this.state.locationY, animated:true})
            // }}

            // {...this._panResponder.panHandlers}
            scrollEnabled={true}>
          
            <View style={{flex:1,width:'100%',alignItems:'center'}}>
              
            <View style={{flex:5,width:'100%',alignItems:'center'}}>
         
         <OTPInputView
     style={{width: '90%', height: 200,fontSize:40}}
     pinCount={6}
      code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
     onCodeChanged = {code => { this.setState({code})}}
     autoFocusOnLoad
     codeInputFieldStyle={styles.underlineStyleBase}
     codeInputHighlightStyle={styles.underlineStyleHighLighted}
     onCodeFilled = {(code => {
         console.log(`Code is ${code}, you are good to go!`)
     })}
 />
 </View>
 <View style={{flex:2,width:'100%',alignItems:'center',paddingHorizontal:25,justifyContent:'center'}}>
   <Text style={{textAlign:'justify',color:'grey',fontSize:15}}>{'OTP (One Time Password) will be sent to the registered mobile number'}</Text>
   </View>
            </View>
            
           
            
          </ScrollView>
        </View>

        {/* <View
        style={{
          flex:this.state.keyboardOpen?1.5:0.8,
          width: "100%",
          backgroundColor:'#00000090',
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <MainButton
          activityIndicatorShow={this.state.settingsLoading}
          buttonWidth={"100%"}
          buttonColor={this.props.theme.buttonColor}
          buttonHeight={'100%'}
          fontSize={18}
          buttonTitle={"Submit"}
          textColor={"#ffff"}
          onButtonPress={() => {
            Keyboard.dismiss();
            this.setState({changingPage:true,settingsLoading:true,},()=>{
              if (
                    this.state.name !== "" &&
                    this.state.mobile.length==10
                  ) {
                   stepOne({
                  name:this.state.name,mobile:this.state.mobile
                })
                  .then(result => {
                    

                    if (result.data.success==true) {
                     this.setState({previousDepth:this.state.pageDepth,},()=>{
                      this.setState({pageDepth:2,settingsLoading:false,changingPage:false,name:'',mobile:'',insertedId:result.data &&result.data.data  && result.data.data.inserted_id?result.data.data.inserted_id:''})
                     })
                    }
                    else{
                      this.setState({settingsLoading:false,changingPage:false})
                      aceAlert('Please enter correct details')
                    }
                  })
                  .catch(err => {
                    this.setState({ settingsLoading: false ,changingPage:false}, () => {});
               
                    console.log("Error", err.response);
                  });
              } else {
                this.setState({ settingsLoading: false ,changingPage:false}, () => {
                  if (this.state.name == "") {
                    alert("Please enter name");
                  } else if (this.state.mobile.length<10) {
                    alert("Please enter mobile number");
                  } 
                })
              
              }
            
            })
            // this.setState({ settingsLoading: true }, () => {
            //   if (
            //     this.state.name !== "" &&
            //     this.state.mobile.length==10
            //   ) {
            //     stepOne({
            //       name:this.state.name,mobile:this.state.mobile
            //     })
            //       .then(result => {
            //         this.setState({ settingsLoading: false });

            //         if (result.data.success==true) {
            //           console.log(result.data, "result add/edit beneficiary");
            //           aceAlert('Wallet Request done successfully\nPending approval')
            //           NavigatorService.pop()
            //         }
            //         else{
            //           aceAlert('Wallet Request failed\nPlease enter correct details')
            //         }
            //       })
            //       .catch(err => {
            //         this.setState({ settingsLoading: false }, () => {});
               
            //         console.log("Error", err.response);
            //       });
            //   } else {
            //     this.setState({ settingsLoading: false }, () => {
            //       if (this.state.name == "") {
            //         alert("Please enter name");
            //       } else if (this.state.mobile<10) {
            //         alert("Please enter mobile number");
            //       } 
            //     });
            //   }
            // });
          }}
        ></MainButton>
      </View> */}
        {/* Aweome Error Alert */}
        <AwesomeAlert
              show={this.state.awesomeErrorAlertShow}
              showProgress={false}
              title="Error!"
              message={this.state.awesomeErrorAlertMessage}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={true}
              showCancelButton={false}
              showConfirmButton={true}
              cancelText="Stay here"
              confirmText="Ok, continue"
              confirmButtonColor="#DD6B55"
              onCancelPressed={() => {
                this.setState({awesomeErrorAlertShow: false});
              }}
              onConfirmPressed={() => {
                this.setState({awesomeErrorAlertShow: false});
              }}
              onDismiss={() => {
                this.setState({awesomeErrorAlertShow: false});
              }}
            />
            {/* General awesome alert */}
            <AwesomeAlert
              show={this.state.awesomeGeneralAlertShow}
              showProgress={false}
              title="Alert!"
              message={this.state.awesomeGeneralAlertMessage}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={true}
              showCancelButton={false}
              showConfirmButton={true}
              cancelText="Stay here"
              confirmText="Ok, continue"
              confirmButtonColor="#449DF5"
              onCancelPressed={() => {
                this.setState({awesomeGeneralAlertShow: false});
              }}
              onConfirmPressed={() => {
                this.setState({awesomeGeneralAlertShow: false});
              }}
              onDismiss={() => {
                this.setState({awesomeGeneralAlertShow: false});
              }}
            />
      </View>
      );
    
  }
}

const styles = StyleSheet.create({
    borderStyleBase: {
      width: 50,
      height: 45
    },
   
    borderStyleHighLighted: {
     // borderColor: "#03DAC6",
    },
   
    underlineStyleBase: {
      width: 50,
      height: 45,
      borderWidth: 0,
      borderBottomWidth: 0,
    },
   
    underlineStyleHighLighted: {
     // borderColor: "#03DAC6",
    },
  });

const mapStateToProps = (state) => ({
  authorization: state.authorization,
  theme: state.theme,
});

export default connect(mapStateToProps)(ForgotPasswordOTP);
