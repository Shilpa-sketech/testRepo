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
import { normalize } from "../Forms/MoneyTransfer/MoneyTransferComponent";
import ModalDropDownMenu from "../../components/DropDownMenu";
import moment from "moment";
import DatePicker from "@react-native-community/datetimepicker";
import { profile_page, get_profile_page_details,getAccountBalance } from "../../actions/forms";
import Toast from "react-native-simple-toast";
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "react-native-fetch-blob";




class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      keyboardOpen: false,
      boxDimension: 0,
      Beneficiaryname: "",
      settingsLoading: false,
      modalOpen: false,
      moneyTransferPageType: "Money Transfer",
      moneyTrasferPageEditable: false,
      editDetails: false,
      userName: "",
      userNameError: "",
      mobileNumber: "",
      mobileNumberError: "",
      emailId: "",
      emailIdError: "",
      password: "",
      rePassword: "",
      reShowPassword: false,
      showPassword: false,
      showTpin: false,
      passwordError: "",
      rePasswordError: "",
      tPin: "",
      tPinError: "",
      dob: moment().format("DD-MM-YYYY"),
      dobSelect: false,
      gender: "",
      id_type: "",
      id_number: "",
      transaction_limit: "",
      name: "",
      profile_pic: '',
      profile_image: "",
      pincode: "",
      address: "",
      acccount_balance:'',
      temp_pic:'',
      profileloading:false,

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

  this.setState({settingsLoading:true,profileloading:true},()=>{
    get_profile_page_details()
    .then(result => {
      if (result.data && result.data.userdata) {
        console.log(result.data,'get profile details')
        let datas=result.data
        this.setState(
          { settingsLoading: false, editDetails: false,profileloading:false },
          () => {
            let result={data:{}}
            result.data={...datas.userdata}
            this.setState(
              {
                name: result.data.name? result.data.name:'',
                address: result.data.address? result.data.address:'',
                mobileNumber: result.data.mobileno? result.data.mobileno :'',
                emailId: result.data.email? result.data.email:'',
                gender: result.data.gender?result.data.gender :'',
                dob: result.data.dob?result.data.dob :moment().format('DD-MM-YYYY'),
                pincode: result.data.pincode? result.data.pincode:'',
                id_type: result.data.idtype?result.data.idtype :'',
                id_number: result.data.idnumber?result.data.idnumber :'',
                transaction_limit: result.data.txnlimit? result.data.txnlimit:'',
                tPin: result.data.txnpin? result.data.txnpin:'',
                date: result.data.credate?result.data.credate :'',
                profile_image: result.data.image_path&& result.data.image? result.data.image_path + result.data.image:''

              },
              () => {

              }
            );
          }
        );
      } else {
        this.setState({ settingsLoading: false,profileloading:false }, () => {});

      }
    })
    .catch(err => {
      this.setState({ settingsLoading: false ,profileloading:false}, () => {});

      console.log("Error", err.response);
    });
  })
  this.setState({settingsLoading:true},()=>{
    getAccountBalance()
    .then(result => {
      console.log(result,'balance')
     if (result.data) {
       
       this.setState(
         { settingsLoading: false, editDetails: false },
         () => {
           this.setState(
             {
               acccount_balance:result.data && result.data.balance?result.data.balance:''

             },
             () => {

             }
           );
         }
       );
     } else {
       this.setState({ settingsLoading: false }, () => {});

     }
   })
   .catch(err => {
     this.setState({ settingsLoading: false }, () => {});

     console.log("Error", err.response);
   });
 })
  }

  componentWillUnmount() {
    //Orientation.unlockAllOrientations();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  

  render() {
  
    const { boxDimension, showPassword } = this.state;
    const GenderList = ["Male", "Female", "Other"];
    const ID_List = [
      "PAN",
      "Passport",
      "Voters ID",
      "Driving License",
      "Ration Card"
    ];
    const ID_List_Data = [
      "PAN",
      "PASSPORT",
      "VOTERS ID",
      "DRIVING LISCENCE",
      "RATION CARD"
    ];
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#ffffff"
        }}
      >
        <View style={{ width: "100%", height: normalize(43) }}>
          <Header
            iconName={"arrow-left"}
            //showIcon={!this.state.settingsLoading}
            iconType="material-community"
            iconColor={"#fff"}
            //iconSize={32}
            onIconPress={() => {
              NavigatorService.reset("HomeScreen");
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
            rightIconName={this.state.editDetails ? "check-square" : "edit"}
            rightIconType={"feather"}
            rightIconColor={"#fff"}
            rightIconMarginRight={5}
            rightIconMarginLeft={5}
            rightOnIconPress={() => {
              if (this.state.editDetails == false) {
                this.setState({ editDetails: !this.state.editDetails, }, () => {
                  Toast.show("Some fields are not editable", Toast.SHORT);
                });
              } else if (this.state.editDetails) {
                let name = this.state.name;
                let address = this.state.address;
                let gender = this.state.gender;
                let dob = this.state.dob;
                let pincode = this.state.pincode;
                let id_type = this.state.id_type;
                let id_number = this.state.id_number;
                let profile_data = this.state.profile_pic;
               


                this.setState({ settingsLoading: true, }, () => {
                  profile_page({
                    name,
                    address,
                    gender,
                    dob,
                    pincode,
                    id_type,
                    id_number,
                    
                  })
                    .then(result => {
                      if (result.data) {
                        this.setState(
                          { settingsLoading: false, editDetails: false },
                          () => {
                            this.setState(
                              {
                                name: result.data.name ? result.data.name : "",
                                address: result.data.address
                                  ? result.data.address
                                  : "",
                                mobileNumber: result.data.mobileno
                                  ? result.data.mobileno
                                  : "",
                                emailId: result.data.email
                                  ? result.data.email
                                  : "",
                                gender: result.data.gender
                                  ? result.data.gender
                                  : "",
                                dob: result.data.dob ? result.data.dob : "",
                                pincode: result.data.pincode
                                  ? result.data.pincode
                                  : "",
                                id_type: result.data.idtype
                                  ? result.data.idtype
                                  : "",
                                id_number: result.data.idnumber
                                  ? result.data.idnumber
                                  : "",
                                transaction_limit: result.data.txnlimit
                                  ? result.data.txnlimit
                                  : "",
                                tPin: result.data.txnpin ? result.data.txnpin : "",
                                date: result.data.credate
                                  ? result.data.credate
                                  : "",
                                profile_image:
                                  result.data.image_path && result.data.image
                                    ? result.data.image_path + result.data.image
                                    : ""
                              },
                              () => {
                                Toast.show(
                                  "Profile Details Updated",
                                  Toast.SHORT
                                );
                              }
                            );
                          }
                        );
                      } else {
                        this.setState({ settingsLoading: false }, () => {});
                        alert("Something went wrong");
                      }
                    })
                    .catch(err => {
                      this.setState({ settingsLoading: false }, () => {});
                      alert("Something went wrong");
                      console.log("Error", err.response);
                    });
                });




                
                RNFetchBlob.fs.readFile(profile_data, 'base64')
                          .then((data) => {
                           // console.log(data)
                       let profile_pic=data
                       
                       

                
                     

 
                     

              //   this.setState({ settingsLoading: true,profile_pic:'' }, () => {
              //     profile_page({
              //       name,
              //       address,
              //       gender,
              //       dob,
              //       pincode,
              //       id_type,
              //       id_number,
              //       profile_pic
              //     })
              //       .then(result => {
              //         if (result.data) {
              //           this.setState(
              //             { settingsLoading: false, editDetails: false },
              //             () => {
              //               this.setState(
              //                 {
              //                   name: result.data.name ? result.data.name : "",
              //                   address: result.data.address
              //                     ? result.data.address
              //                     : "",
              //                   mobileNumber: result.data.mobileno
              //                     ? result.data.mobileno
              //                     : "",
              //                   emailId: result.data.email
              //                     ? result.data.email
              //                     : "",
              //                   gender: result.data.gender
              //                     ? result.data.gender
              //                     : "",
              //                   dob: result.data.dob ? result.data.dob : "",
              //                   pincode: result.data.pincode
              //                     ? result.data.pincode
              //                     : "",
              //                   id_type: result.data.idtype
              //                     ? result.data.idtype
              //                     : "",
              //                   id_number: result.data.idnumber
              //                     ? result.data.idnumber
              //                     : "",
              //                   transaction_limit: result.data.txnlimit
              //                     ? result.data.txnlimit
              //                     : "",
              //                   tPin: result.data.txnpin ? result.data.txnpin : "",
              //                   date: result.data.credate
              //                     ? result.data.credate
              //                     : "",
              //                   profile_image:
              //                     result.data.image_path && result.data.image
              //                       ? result.data.image_path + result.data.image
              //                       : ""
              //                 },
              //                 () => {
              //                   Toast.show(
              //                     "Profile Details Updated",
              //                     Toast.SHORT
              //                   );
              //                 }
              //               );
              //             }
              //           );
              //         } else {
              //           this.setState({ settingsLoading: false }, () => {});
              //           alert("Something went wrong");
              //         }
              //       })
              //       .catch(err => {
              //         this.setState({ settingsLoading: false }, () => {});
              //         alert("Something went wrong");
              //         console.log("Error", err.response);
              //       });
              //   });
              // }).catch(err=>{

              //   this.setState({ settingsLoading: true, }, () => {
              //     profile_page({
              //       name,
              //       address,
              //       gender,
              //       dob,
              //       pincode,
              //       id_type,
              //       id_number,
                    
              //     })
              //       .then(result => {
              //         if (result.data) {
              //           this.setState(
              //             { settingsLoading: false, editDetails: false },
              //             () => {
              //               this.setState(
              //                 {
              //                   name: result.data.name ? result.data.name : "",
              //                   address: result.data.address
              //                     ? result.data.address
              //                     : "",
              //                   mobileNumber: result.data.mobileno
              //                     ? result.data.mobileno
              //                     : "",
              //                   emailId: result.data.email
              //                     ? result.data.email
              //                     : "",
              //                   gender: result.data.gender
              //                     ? result.data.gender
              //                     : "",
              //                   dob: result.data.dob ? result.data.dob : "",
              //                   pincode: result.data.pincode
              //                     ? result.data.pincode
              //                     : "",
              //                   id_type: result.data.idtype
              //                     ? result.data.idtype
              //                     : "",
              //                   id_number: result.data.idnumber
              //                     ? result.data.idnumber
              //                     : "",
              //                   transaction_limit: result.data.txnlimit
              //                     ? result.data.txnlimit
              //                     : "",
              //                   tPin: result.data.txnpin ? result.data.txnpin : "",
              //                   date: result.data.credate
              //                     ? result.data.credate
              //                     : "",
              //                   profile_image:
              //                     result.data.image_path && result.data.image
              //                       ? result.data.image_path + result.data.image
              //                       : ""
              //                 },
              //                 () => {
              //                   Toast.show(
              //                     "Profile Details Updated",
              //                     Toast.SHORT
              //                   );
              //                 }
              //               );
              //             }
              //           );
              //         } else {
              //           this.setState({ settingsLoading: false }, () => {});
              //           alert("Something went wrong");
              //         }
              //       })
              //       .catch(err => {
              //         this.setState({ settingsLoading: false }, () => {});
              //         alert("Something went wrong");
              //         console.log("Error", err.response);
              //       });
              //   });

              })
              }
            }}
          />
        </View>

        <View style={{ flex: 9, width: "100%" }}>
          <View
            style={{
              height: 140,
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingLeft: 20
            }}
          >
           
             
            <TouchableOpacity
              //disabled={!this.state.editDetails}
              disabled={true}
              style={{
                backgroundColor:this.state.profile_image == ""  && this.state.profileloading==false? "#ED5264db" : "#ffff",
                height: 80,
                width: 80,
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 10,
                overflow: "hidden"
              }}
              onPress={() => {
                DocumentPicker.pick({ type: [DocumentPicker.types.images] })
                  .then(res => {
                    // console.log(
                    //    res.uri,
                    //    res.type, // mime type
                    //    res.name,
                    //    res.size
                    // );
                    this.setState({ profile_pic: res.uri ,profile_image:res.uri}, () => {
                      console.log(this.state.profile_pic, "rrrrr");
                    });
                  })
                  .catch(err => {
                    if (DocumentPicker.isCancel(err)) {
                      // User cancelled the picker, exit any dialogs or menus and move on
                    } else {
                      throw err;
                    }
                  });
              }}
            >
              {/* {this.state.editDetails&&( <Text style={{position:'absolute',zIndex:1500,fontSize:18,alignItems:'center',justifyContent:'center',color:'white',fontWeight:'600',width:80,backgroundColor:'#c0c0c899',paddingLeft:'30%',paddingVertical:2}}>Edit</Text>
              )} */}
               
              {this.state.profile_image !== ""   ? (
                <Image
                  style={{ height: 80, width: 80 }}
                  resizeMode={"contain"}
                  source={{
                    uri: this.state.profile_image
                  }}
                />
              ) :this.state.profileloading==false? (
                <Icon
                  color="#fff"
                  size={60}
                  type="material-community"
                  underlayColor="rgba(255,255,255,0)"
                  name={"account"}
                  //name={'eye'}
                />
              ):(<ActivityIndicator size={'large'} color={'#c0c0c8'}/>)}

            </TouchableOpacity>
           
            <View style={{ paddingLeft: 20, overflow: "hidden" }}>
            {this.state.acccount_balance!=='' &&(
              <Text style={{ fontSize: 22, marginVertical: 2 }}>
                Wallet Balance
              </Text>
            )}
              <View style={{ flexDirection: "row" }}>
                {this.state.acccount_balance!=='' &&(
                <Icon
                  color="#151515"
                  size={24}
                  type="font-awesome"
                  underlayColor="rgba(255,255,255,0)"
                  name={"rupee"}
                  containerStyle={{ marginTop: 6, marginRight: 10 }}
                />
                )}
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 24, width: 200, color: "#151515" }}
                >
                  {this.state.acccount_balance}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 9 }}>
            <ScrollView
              ref={ref => (this.scrollView = ref)}
              // onContentSizeChange={(contentWidth, contentHeight)=>{
              //     this.scrollView.scrollResponderScrollToEnd({animated: true});
              // }}

              style={{}}
              contentContainerStyle={{
                alignItems: "center",
                paddingTop: 5,
                paddingBottom: 20
              }}
            >
              <Input
                disabled={!this.state.editDetails}
                autoCapitalize={"none"}
                inputContainerStyle={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: "#c0c0c8",
                  marginLeft: 1
                }}
               
                containerStyle={{
                  width: "95%",
                  paddingHorizontal: 0,
                  marginBottom: 20
                  // this.state.userNameError == "" ||
                  // this.state.userNameError == "Username available"
                  //   ? 20
                  //   : 7
                }}
                autoCorrect={false}
                // keyboardType={'email-address'}
                label={"Name"}
                labelStyle={{
                  color: "#002b36",
                  fontSize: 14,
                  marginBottom: 10,
                  marginLeft: 0
                }}
                placeholderTextColor={"grey"}
                placeholder={"Name"}
                value={this.state.name}
                autoCompleteType={"name"}
                onChangeText={text => this.setState({ name: text })}
                maxLength={30}
                // errorStyle={{ color: "red" }}
                // errorMessage={
                //   this.state.userNameError == "Username available"
                //     ? ""
                //     : this.state.userNameError
                // }
                // onBlur={() => {
                //   if (this.state.userName == "") {
                //     this.setState({ userNameError: "" });
                //   } else if (this.state.userName.length < 3) {
                //     this.setState({
                //       userNameError:
                //         "Username should contain atleast 3 characters"
                //     });
                //   } else {
                //     this.setState({ userNameError: "Username available" });
                //   }
                // }}
                // rightIcon={
                //   <Icon
                //     color="green"
                //     size={20}
                //     type="entypo"
                //     underlayColor="rgba(255,255,255,0)"
                //     name={
                //       this.state.userNameError != "Username available"
                //         ? ""
                //         : "check"
                //     }
                //name={'eye'}
                //   />
                // }
              />

              <Input
                disabled={!this.state.editDetails}
                autoCapitalize={"none"}
                inputContainerStyle={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: "#c0c0c8",
                  marginLeft: 1,
                  textAlignVertical: "top"
                }}
                inputStyle={{ textAlignVertical: "top" }}
                containerStyle={{
                  width: "95%",
                  paddingHorizontal: 0,
                  marginBottom: 20
                }}
                autoCorrect={false}
                // keyboardType={'email-address'}
                label={"Address"}
                labelStyle={{
                  color: "#002b36",
                  fontSize: 14,
                  marginBottom: 10,
                  marginLeft: 0
                }}
                placeholderTextColor={"grey"}
                placeholder={"Enter  address"}
                numberOfLines={3}
                multiline={true}
                maxLength={30}
                autoCompleteType={"street-address"}
                value={this.state.address}
                onChangeText={text => this.setState({ address: text })}
              />

              <Input
                disabled={true}
                autoCapitalize={"none"}
                inputContainerStyle={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: "#c0c0c8",
                  marginLeft: 1
                }}
                containerStyle={{
                  width: "95%",
                  paddingHorizontal: 0,
                  marginBottom:
                    this.state.mobileNumberError == "" ||
                    this.state.mobileNumberError == "mobileNumber available"
                      ? 20
                      : 7
                }}
                autoCorrect={false}
                keyboardType={"numeric"}
                label={"Mobile Number"}
                labelStyle={{
                  color: "#002b36",
                  fontSize: 14,
                  marginBottom: 10,
                  marginLeft: 0
                }}
                placeholderTextColor={"grey"}
                placeholder={"Mobile number"}
                value={this.state.mobileNumber}
                autoCompleteType={"name"}
                onChangeText={text => this.setState({ mobileNumber: text })}
                maxLength={10}
                errorStyle={{ color: "red" }}
                errorMessage={
                  this.state.mobileNumberError == "mobileNumber available"
                    ? ""
                    : this.state.mobileNumberError
                }
                onBlur={() => {
                  if (this.state.mobileNumber == "") {
                    this.setState({ mobileNumberError: "" });
                  } else if (this.state.mobileNumber.length < 10) {
                    this.setState({
                      mobileNumberError: "please enter 10 digit mobile number"
                    });
                  } else {
                    this.setState({
                      mobileNumberError: "mobileNumber available"
                    });
                  }
                }}
                rightIcon={
                  <Icon
                    color="green"
                    size={20}
                    type="entypo"
                    underlayColor="rgba(255,255,255,0)"
                    name={
                      this.state.mobileNumberError != "mobileNumber available"
                        ? ""
                        : "check"
                    }
                    //name={'eye'}
                  />
                }
              />
              <Input
                disabled={true}
                autoCapitalize={"none"}
                inputContainerStyle={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: "#c0c0c8",
                  marginLeft: 1
                }}
                containerStyle={{
                  width: "95%",
                  paddingHorizontal: 0,
                  marginBottom:
                    this.state.emailIdError == "" ||
                    this.state.emailIdError == "emailId available"
                      ? 20
                      : 7
                }}
                autoCorrect={false}
                keyboardType={"email-address"}
                label={"E-Mail Id"}
                labelStyle={{
                  color: "#002b36",
                  fontSize: 14,
                  marginBottom: 10,
                  marginLeft: 0
                }}
                placeholderTextColor={"grey"}
                placeholder={"Enter email id"}
                value={this.state.emailId}
                autoCompleteType={"tel"}
                onChangeText={text => this.setState({ emailId: text })}
                errorStyle={{ color: "red" }}
                errorMessage={
                  this.state.emailIdError == "emailId available"
                    ? ""
                    : this.state.emailIdError
                }
                onBlur={() => {
                  if (this.state.emailId == "") {
                    this.setState({ emailIdError: "" });
                  } else if (
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                      this.state.emailId
                    )
                  ) {
                    this.setState({ emailIdError: "emailId available" });
                  } else {
                    this.setState({
                      emailIdError: "Please enter a valid email address"
                    });
                  }
                }}
                rightIcon={
                  <Icon
                    color="green"
                    size={20}
                    type="entypo"
                    underlayColor="rgba(255,255,255,0)"
                    name={
                      this.state.emailIdError != "emailId available"
                        ? ""
                        : "check"
                    }
                    //name={'eye'}
                  />
                }
              />

              <View
                style={{
                  height: 80,
                  width: "95%",
                  alignItems: "flex-start",
                  marginTop: 0
                }}
              >
                <ModalDropDownMenu
                  initialValue={this.state.gender!==''?this.state.gender:"Select Gender"}
                  LabelpaddingBottom={10}
                  list={GenderList}
                  label={"Select Gender"}
                  value={this.state.gender}
                  dropDownLayoutHeight={300}
                  showLabel={true}
                  // paddingLeft={-5}
                  //dropDownWidth={'95%'}
                  editable={this.state.editDetails}
                  textColor={"#4D4B4B"}
                  onSelectAnOption={index => {
                    this.setState({ gender: GenderList[index] });
                  }}
                />
              </View>

              <Input
                disabled={!this.state.editDetails}
                editable={false}
                autoCapitalize={"none"}
                inputContainerStyle={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: "#c0c0c8",
                  marginLeft: 1
                }}
                containerStyle={{
                  width: "95%",
                  paddingHorizontal: 0,
                  marginTop: 20
                }}
                autoCorrect={false}
                // keyboardType={'email-address'}
                label={"Date Of Birth"}
                labelStyle={{
                  color: "#002b36",
                  fontSize: 14,
                  marginBottom: 10,
                  marginLeft: 0
                }}
                placeholderTextColor={"grey"}
                placeholder={"Enter dob"}
                value={this.state.dob}
                rightIcon={
                  <Icon
                    color="#444"
                    size={20}
                    type="entypo"
                    underlayColor="rgba(255,255,255,0)"
                    name={this.state.editDetails ? "calendar" : ""}
                    //name={'eye'}
                    onPress={() => {
                      if (this.state.editDetails) {
                        this.setState({
                          dobSelect: !this.state.dobSelect
                        });
                      }
                    }}
                  />
                }
                //onChangeText={text => this.setState({ DateofPayment: text })}
              />
              {this.state.dobSelect && (
                <DatePicker
                  style={{ backgroundColor: "#fff", width: "100%" }}
                  mode="date"
                  format="DD-MM-YYYY"
                  // minimumDate={
                  //   new Date(
                  //     parseInt(
                  //       moment()
                  //         .format("DD-MM-YYYY")
                  //         .split("-")[2]
                  //     ),
                  //     parseInt(
                  //       moment()
                  //         .format("DD-MM-YYYY")
                  //         .split("-")[1]
                  //     ) - 1,
                  //     parseInt(
                  //       moment()
                  //         .format("DD-MM-YYYY")
                  //         .split("-")[0]
                  //     )
                  //   )
                  // }
                  maximumDate={new Date()}
                  date={this.state.dob}
                  value={
                    new Date(
                      parseInt(this.state.dob.split("-")[2]),
                      parseInt(this.state.dob.split("-")[1]) - 1,
                      parseInt(this.state.dob.split("-")[0])
                    )
                  }
                  confirmBtnText={"Confirm"}
                  cancelBtnText={"Cancel"}
                  showIcon={false}
                  onChange={(event, date) => {
                    this.setState({
                      dob: moment(date).format("DD-MM-YYYY"),

                      dobSelect: false
                    });
                  }}
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                      alignItems: "flex-start"
                      //marginLeft: 10,
                    },
                    dateText: {
                      color: "#000",
                      fontSize: 18
                    },
                    disabled: {
                      backgroundColor: "#ffff"
                    }
                  }}
                />
              )}

              <Input
                disabled={!this.state.editDetails}
                autoCapitalize={"none"}
                inputContainerStyle={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: "#c0c0c8",
                  marginLeft: 1
                }}
                containerStyle={{
                  width: "95%",
                  paddingHorizontal: 0,
                  marginTop: 20
                }}
                autoCorrect={false}
                keyboardType={"numeric"}
                label={"PinCode"}
                labelStyle={{
                  color: "#002b36",
                  fontSize: 14,
                  marginBottom: 10,
                  marginLeft: 0
                }}
                placeholderTextColor={"grey"}
                placeholder={"Pin code"}
                value={this.state.pincode}
                onChangeText={text => this.setState({ pincode: text })}
              />

              <View
                style={{
                  height: 80,
                  width: "95%",
                  alignItems: "flex-start",
                  marginTop: 20
                }}
              >
                <ModalDropDownMenu
                  initialValue={this.state.id_type?this.state.id_type:"Select ID"}
                  LabelpaddingBottom={10}
                  list={ID_List_Data}
                  label={"Id Type"}
                  value={this.state.id_type.toUpperCase()}
                  dropDownLayoutHeight={300}
                  showLabel={true}
                  // paddingLeft={-5}
                  //dropDownWidth={'95%'}
                  editable={this.state.editDetails}
                  textColor={"#4D4B4B"}
                  onSelectAnOption={index => {
                    this.setState({ id_type: ID_List[index] });
                  }}
                />
              </View>

              <Input
                disabled={!this.state.editDetails}
                autoCapitalize={"none"}
                inputContainerStyle={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: "#c0c0c8",
                  marginLeft: 1
                }}
                containerStyle={{
                  width: "95%",
                  paddingHorizontal: 0,
                  marginTop: 20
                }}
                autoCorrect={false}
                //keyboardType={'numeric'}
                label={"Id Number"}
                labelStyle={{
                  color: "#002b36",
                  fontSize: 14,
                  marginBottom: 10,
                  marginLeft: 0
                }}
                placeholderTextColor={"grey"}
                placeholder={"Id number"}
                value={this.state.id_number}
                // autoCompleteType={'tel'}
                maxLength={10}
                onChangeText={text => this.setState({ id_number: text })}
              />

              <Input
                disabled={true}
                autoCapitalize={"none"}
                inputContainerStyle={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: "#c0c0c8",
                  marginLeft: 1
                }}
                containerStyle={{
                  width: "95%",
                  paddingHorizontal: 0,
                  marginTop: 20,
                  marginBottom: 20
                }}
                autoCorrect={false}
                // keyboardType={'email-address'}
                label={"Transaction Limit"}
                labelStyle={{
                  color: "#002b36",
                  fontSize: 14,
                  marginBottom: 10,
                  marginLeft: 0
                }}
                placeholderTextColor={"grey"}
                placeholder={"Transaction limit"}
                value={this.state.transaction_limit}
                onChangeText={text =>
                  this.setState({ transaction_limit: text })
                }
              />

              <Input
                disabled={true}
                autoCapitalize={"none"}
                inputContainerStyle={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: "#c0c0c8",
                  marginLeft: 1
                }}
                containerStyle={{
                  width: "95%",
                  paddingHorizontal: 0
                }}
                maxLength={6}
                autoCorrect={false}
                keyboardType={"numeric"}
                label={"Transaction-Pin"}
                labelStyle={{
                  color: "#002b36",
                  fontSize: 14,
                  marginBottom: 10,
                  marginLeft: 0
                }}
                secureTextEntry={!this.state.showTpin}
                placeholderTextColor={"grey"}
                placeholder={"Transaction-PIn"}
                value={this.state.tPin}
                onChangeText={text => this.setState({ tPin: text })}
                rightIcon={
                  <Icon
                    color="#444"
                    size={20}
                    type="entypo"
                    underlayColor="rgba(255,255,255,0)"
                    name={!this.state.showTpin ? "eye" : "eye-with-line"}
                    //name={'eye'}
                    onPress={() =>
                      this.setState({ showTpin: !this.state.showTpin })
                    }
                  />
                }
                errorStyle={{ color: "red" }}
                errorMessage={
                  this.state.tPinError == "tPin available"
                    ? ""
                    : this.state.tPinError
                }
                onBlur={() => {
                  if (this.state.tPin == "") {
                    this.setState({ tPinError: "" });
                  } else if (this.state.tPin.length < 6) {
                    this.setState({
                      tPinError: "please enter 6 digit M-Pin number"
                    });
                  } else {
                    this.setState({ tPinError: "tPin available" });
                  }
                }}
              />

              <Input
                disabled={true}
                autoCapitalize={"none"}
                inputContainerStyle={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: "#c0c0c8",
                  marginLeft: 1
                }}
                containerStyle={{
                  width: "95%",
                  paddingHorizontal: 0,
                  marginTop: 20
                }}
                autoCorrect={false}
                // keyboardType={'email-address'}
                label={"Date"}
                labelStyle={{
                  color: "#002b36",
                  fontSize: 14,
                  marginBottom: 10,
                  marginLeft: 0
                }}
                placeholderTextColor={"grey"}
                placeholder={"Date"}
                value={this.state.date}
                onChangeText={text => this.setState({ date: text })}
              />

              {/* <Input
            disabled={true}
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
              label={"KYC Status"}
              labelStyle={{ color: "#002b36", fontSize: 14, marginBottom: 10 ,marginLeft:0}}
              placeholderTextColor={"grey"}
              placeholder={"Kyc status"}
              value={this.state.district}
              
              onChangeText={text => this.setState({ district: text })}
              
            />
             */}
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
        {this.state.settingsLoading && <CenterLoading color={"black"} />}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  authorization: state.authorization,
  theme: state.theme
});

export default connect(mapStateToProps)(Profile);
