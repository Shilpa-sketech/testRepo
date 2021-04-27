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
  InteractionManager 
} from 'react-native';
import {connect} from 'react-redux';
import {Icon, Input, normalize, Button} from 'react-native-elements';
import NavigatorService from '../../router/NavigatorService';
import AwesomeAlert from 'react-native-awesome-alerts';
import MainButton from '../../components/MainButton';
import Header from '../../components/Header';
import CenterLoading from '../../components/CenterLoading';
import {login} from '../../actions/login';
import {webSocket} from '../../utils/webSocket';
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
class Login extends Component {
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
    };

    this.keyboardHeight = new Animated.Value(0);
    this.imageHeight = new Animated.Value(this.IMAGE_HEIGHT);
    this.textHeight = new Animated.Value(this.text_HEIGHT);
  }
  componentDidMount() {
    AsyncStorage.getItem('refresh_token')
      .then((result) => {
        console.log(result, 'async');
        if (result !== null) {
          if (result !== 'xxxx') {
            AsyncStorage.getItem('agent_email')
              .then((result) => {
                console.log(result, 'async');
                if (result !== null) {
                  store.dispatch({type: 'SET_AGENT_EMAIL', payload: result});
                }
              })
              .catch((err) => {
                AsyncStorage.setItem('agent_email', '');
              });
            store.dispatch({type: 'SET_BEARER_TOKEN', payload: result});
            setTimeout(() => {
              NavigatorService.reset('HomeScreen');
            }, 1000);
          } else {
            setTimeout(() => {
              this.setState({loginLoading: false});
            }, 1000);
          }
        } else {
          setTimeout(() => {
            this.setState({loginLoading: false});
          }, 1000);
        }
      })
      .catch((err) => {
        AsyncStorage.setItem('refresh_token', 'xxxx');
        setTimeout(() => {
          this.setState({loginLoading: false});
        }, 1000);
      });

    this.keyboardWillShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardWillHide,
    );
  }

  componentWillUnmount() {
    //Orientation.unlockAllOrientations();
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
      }),
      Animated.timing(this.imageHeight, {
        duration: event.duration,
        toValue: this.IMAGE_HEIGHT_SMALL,
      }),
      Animated.timing(this.textHeight, {
        duration: event.duration,
        toValue: this.text_HEIGHT_SMALL,
      }),
    ]).start();
  };

  keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }),
      Animated.timing(this.imageHeight, {
        duration: event.duration,
        toValue: this.IMAGE_HEIGHT,
      }),
      Animated.timing(this.textHeight, {
        duration: event.duration,
        toValue: this.text_HEIGHT,
      }),
    ]).start();
  };

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
    if (this.state.loginLoading == false) {
      return (
        <TouchableWithoutFeedback
          style={{height: '100%', width: '100%'}}
          onPress={() => {
            //Keyboard.dismiss();
          }}>
          <AniamtedSafeAreaView
            style={{
              flex: 1,
              backgroundColor: '#fff',
              justifyContent: 'center',
            }}>
            {this.state.keyboardOpen == false && (
              <Animated.View
                style={{
                  flex: this.imageHeight.interpolate({
                    inputRange: [140, 200],
                    outputRange: [2, 1],
                    extrapolate: 'clamp',
                  }),
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                <View
                  style={{width: 200, height: '100%', flexDirection: 'row'}}>
                  <View
                    style={{
                      justifyContent: 'center',
                      paddingLeft: 5,
                      borderRadius: 25,
                    }}>
                    <Animated.Image
                      style={[
                        {
                          opacity: 1,

                          // marginBottom:20
                        },
                        {height: this.imageHeight, width: this.imageHeight},
                      ]}
                      resizeMode={'contain'}
                      source={require('../../images/acelogo.png')}
                    />
                  </View>
                  {/* <View style={{ marginLeft: -3, justifyContent: 'center', backgroundColor: '#fff' }}>
										<Animated.Text
											style={[
												{
													fontSize: this.imageHeight.interpolate({
														inputRange: [140, 200],
														outputRange: [21, 32],
														extrapolate: 'clamp',
													}),
													color: '#fff',
													fontWeight: 'bold',
													backgroundColor: '#4348B0',
													paddingVertical: this.imageHeight.interpolate({
														inputRange: [140, 200],
														outputRange: [5,5],
														extrapolate: 'clamp',
													}),
													paddingHorizontal: this.imageHeight.interpolate({
														inputRange: [140, 200],
														outputRange: [6, 8],
														extrapolate: 'clamp',
													}),
													borderRadius: 5,fontFamily: 'sans-serif-condensed',

												},
											]}
										>
											ACEMONEY
										</Animated.Text>
									</View> */}
                </View>
              </Animated.View>
            )}
            <Animated.View
              style={{
                flex: this.imageHeight.interpolate({
                  inputRange: [140, 200],
                  outputRange: [6, 5],
                  extrapolate: 'clamp',
                }),

                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}>
              <Animated.View
                style={{
                  height: this.imageHeight.interpolate({
                    inputRange: [140, 200],
                    outputRange: ['100%', '60%'],
                    extrapolate: 'clamp',
                  }),
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Animated.View
                  style={{
                    height: this.imageHeight.interpolate({
                      inputRange: [140, 200],
                      outputRange: [80, 100],
                      extrapolate: 'clamp',
                    }),
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <Input
                    autoCapitalize={'none'}
                    inputContainerStyle={{
                      height: 48,
                      fontSize: 14,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#eaeaea',
                      backgroundColor: '#fafafa',
                      
                      // marginLeft: 15,
                      // marginRight: 15,
                     
                    }}
                    containerStyle={{
                      width: '95%',
                      paddingHorizontal: 0,
                    
                    }}
                    inputStyle={{paddingHorizontal: 10}}
                    autoCompleteType={'email'}
                    autoCorrect={false}
                    keyboardType={'email-address'}
                    //label={'Email Id'}
                    labelStyle={{color: 'grey', fontSize: 14, marginBottom: 10}}
                    placeholderTextColor={'#9fa0a4'}
                    placeholder={'Enter your email id'}
                    value={this.state.username}
                    onChangeText={(text) => this.setState({username: text})}
                  />
                </Animated.View>
                <Animated.View
                  style={{
                    height: this.imageHeight.interpolate({
                      inputRange: [140, 200],
                      outputRange: [80, 100],
                      extrapolate: 'clamp',
                    }),
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <Input
                    autoCapitalize={'none'}
                    inputContainerStyle={{
                     height: 48,
                      fontSize: 14,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#eaeaea',
                      backgroundColor: '#fafafa',
                      
                      // marginLeft: 15,
                      // marginRight: 15,
                     
                    }}
                    containerStyle={{
                      width: '95%',
                      paddingHorizontal: 0,
                    }}
                    inputStyle={{paddingHorizontal: 10}}
                    autoCompleteType={'password'}
                    autoCorrect={false}
                    // keyboardType={'email-address'}
                    //label={'Password'}
                    labelStyle={{color: 'grey', fontSize: 14, marginBottom: 10}}
                    placeholderTextColor={'#9fa0a4'}
                    placeholder={'Enter your password'}
                    value={this.state.password}
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => this.setState({password: text})}
                    rightIcon={
                      <TouchableOpacity style={{width:50,height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'transparent'}} onPress={() =>
                        this.setState({showPassword: !showPassword})
                      }>
                      <Icon
                        color="#444"
                        size={20}
                        type="entypo"
                        underlayColor="rgba(255,255,255,0)"
                        name={!showPassword ? 'eye' : 'eye-with-line'}
                        //name={'eye'}
                       
                        
                      />
                      </TouchableOpacity>
                    }
                  />
                  <Animated.View
                  style={{
                    // flex: this.imageHeight.interpolate({
                    //   inputRange: [140, 200],
                    //   outputRange: [1,1],
                    //   extrapolate: 'clamp',
                    // }),
                   
                    width:'100%',
                    paddingRight: 20,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    
                  }}>
                   <TouchableOpacity style={{flexDirection:'row',padding:0}} onPress={()=>{NavigatorService.navigate('ForgotPasswordScreen')}}>
                     {/* <View  style={{marginRight:3.8,alignItems:'center',justifyContent:'center',paddingTop:2}}><Icon name={'exclamationcircleo'} type={'antdesign'} color={'#FB1764'} size={13}/></View> */}
                   <Text style={{fontSize:15,color:'#646464',textDecorationLine: 'underline'}}>Forgot Password?</Text></TouchableOpacity> 
                </Animated.View>
                </Animated.View>
               
                <Animated.View
                  style={{
                    flex: this.imageHeight.interpolate({
                      inputRange: [140, 200],
                      outputRange: [1, 1],
                      extrapolate: 'clamp',
                    }),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {this.state.showButton == true && (
                    <MainButton
                      activityIndicatorShow={this.state.settingsLoading}
                      buttonTitle={'asd'}
                      buttonWidth={'95.2%'}
                      buttonColor={this.props.theme.buttonColor}
                      buttonHeight={this.imageHeight.interpolate({
                        inputRange: [140, 200],
                        outputRange: [45, 45],
                        extrapolate: 'clamp',
                      })}
                      borderRadius={5}
                      fontSize={18}
                      buttonTitle={'Login'}
                      textColor={'#ffff'}
                      onButtonPress={() => {
                        //Keyboard.dismiss();
                        this.setState({settingsLoading: true}, () => {
                          if (
                            this.state.username !== '' &&
                            this.state.password !== ''
                          ) {
                            login({
                              username: this.state.username,
                              password: this.state.password,
                            })
                              .then((result) => {
                                this.setState({settingsLoading: false});
                                console.log(result, 'result');
                                if (
                                  result.data &&
                                  result.data.success == true &&
                                  result.data.token &&
                                  result.data.token !== ''
                                ) {
                                  AsyncStorage.setItem(
                                    'refresh_token',
                                    result.data.token,
                                  );
                                  AsyncStorage.setItem(
                                    'agent_email',
                                    this.state.username,
                                  );
                                  store.dispatch({
                                    type: 'SET_BEARER_TOKEN',
                                    payload: result.data.token,
                                  });
                                  store.dispatch({
                                    type: 'SET_AGENT_EMAIL',
                                    payload: this.state.username,
                                  });
                                  //  webSocket()
                                  this.setState(
                                    {username: this.state.username},
                                    () => {
										
                                      NavigatorService.reset('HomeScreen');
                                    },
                                  );
                                } else {
                                  this.generalAwesomeAlertMessage(
                                    'Incorrect username/password',
                                  );
                                }
                              })
                              .catch((err) => {
                                this.setState({settingsLoading: false}, () => {
                                  this.errorAwesomeAlertMessage(
                                    'Something went wrong',
                                    0,
                                  );
                                });

                                console.log('Error', err.response);
                              });
                          } else {
                            this.setState({settingsLoading: false}, () => {
                              if (this.state.username == '') {
                                this.generalAwesomeAlertMessage(
                                  'Please enter username',
                                );
                              } else {
                                this.generalAwesomeAlertMessage(
                                  'Please enter password',
                                );
                              }
                            });
                          }
                        });
                      }}
                    />
                  )}
                  
                </Animated.View>
               
              </Animated.View>
            </Animated.View>
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
          </AniamtedSafeAreaView>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',

            //paddingLeft: 10
          }}>
          <View
            style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
            {/* <Text style={{fontSize:18,fontWeight:'bold'}}>Enter Your Login Credentials</Text> */}
            <Image
              style={{
                borderWidth: 2,
                height: 300,
                width: 300,
                //opacity:0.85
              }}
              resizeMode={'contain'}
              source={require('../../images/acelogo.png')}
            />
          </View>
          {/* <View style={{height:200,width:60,justifyContent:'center',alignItems:'center'}}> */}
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <UIActivityIndicator
              size={36}
              color={'grey'}
              animating={this.props.animating}
              hidesWhenStopped={true}
            />
          </View>
          {/* </View>
        </View> */}
        </SafeAreaView>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  authorization: state.authorization,
  theme: state.theme,
});

export default connect(mapStateToProps)(Login);
