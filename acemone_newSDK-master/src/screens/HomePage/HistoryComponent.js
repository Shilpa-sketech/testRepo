import React, {Component} from 'react';
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
  PermissionsAndroid,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {Icon, Input} from 'react-native-elements';
import NavigatorService from '../../router/NavigatorService';
import Share from 'react-native-share';
import MainButton from '../../components/MainButton';
import moment from 'moment';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import store from '../../store';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import {apiRoot} from '../../actions/login';
import Mahagram from '../../../Payment';
// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

class HistoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      keyboardOpen: false,
      boxDimension: 0,
      username: '',
      mpinpassword: '',
      clicked: false,
      pdf_download_loading: false,
      pdf_share_loading: false,
      downloadPayload: '',
    };
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

  async downloadFile(fromDate, option, type) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.actualDownload(fromDate, option, type);
      } else {
        this.setState({
          pdf_download_loading: false,
          pdf_share_loading: false,
        });
        Alert.alert(
          'Permission Denied!',
          'You need to give storage permission to download the file',
        );
      }
    } catch (err) {
      this.setState({
        pdf_download_loading: false,
        pdf_share_loading: false,
      });
      console.warn(err);
    }
  }

  actualDownload = (fromDate, option, type) => {
    const {dirs} = RNFetchBlob.fs;
    let file_name =
      'acemoney_' +
      type +
      '_' +
      fromDate +
      '_' +
      Math.floor(new Date().getTime() + new Date().getSeconds() / 2);
    let filePath = null;
    RNFetchBlob.config(
      option == 'download'
        ? {
            fileCache: true,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: option == 'download' ? true : false,
              mediaScannable: true,
              title: `${file_name}.pdf`,
              path:
                option == 'download'
                  ? `${dirs.DownloadDir}/${file_name}.pdf`
                  : `${dirs.CacheDir}/temp/foo/${file_name}.pdf`,
            },
          }
        : {fileCache: true, appendExt: 'pdf'},
    )
      .fetch(
        'GET',
        apiRoot + 'api/agent-app-BillpaymentsPDF/' + this.state.downloadPayload,
        {},
        // {'Content-Type': 'multipart/form-data','Cache-Control': 'no-store'},
        // [
        //   {name: 'agent_email', data: store.getState().login.agentEmail},
        //   {name: 'billid', data:this.state.downloadPayload},
        // ],
      )
      .then((res) => {
        filePath = res.path();
        console.log('The file saved to ', res.path());

        if (option == 'download') {
          Mahagram.Toast(
            `File Download Complete\n${dirs.DownloadDir}/${file_name}.pdf`,
          );
          this.setState({
            pdf_download_loading: false,
            pdf_share_loading: false,
          });
        } else {
          return res.readFile('base64');
        }
      })

      .then(async (base64Data) => {
        base64Data = (await `data:application/pdf;base64,`) + base64Data;
        console.log('PDF RNF then2', base64Data);

        try {
          await Share.open({
            url: base64Data,
            type: 'application/pdf',
            title: 'acemoney_' + type + '_' + 'reciept from ' + fromDate,
            filename: file_name + '.pdf',
            subject: 'acemoney_' + type + '_' + 'reciept from ' + fromDate,
          });
          // remove the image or pdf from device's storage
          await RNFS.unlink(filePath);
          this.setState({
            pdf_download_loading: false,
            pdf_share_loading: false,
          });
        } catch (error) {
          this.setState({
            pdf_download_loading: false,
            pdf_share_loading: false,
          });
          console.log('PDF then2 err', error);
        }
      })
      .catch((e) => {
        this.setState({
          pdf_download_loading: false,
          pdf_share_loading: false,
        });
        console.log(e);
      });
  };

  render() {
    let {page, type} = this.props;

    if (type == 'report') {
      return this.Component();
    } else if (type == 'mahagram') {
      return this.mahagramComponent();
    } else if (type == 'icici') {
      return this.iciciComponent();
    } else if (type == 'kseb') {
      return this.ksebComponent();
    } else if (type == 'water_authority') {
      return this.waterAuthorityComponent();
    } else if (type == 'bsnl') {
      return this.bsnlComponent();
    } else if (type == 'asianet') {
      return this.asianetComponent();
    } else if (type == 'mobile') {
      return this.rechargeComponent('MOBILE');
    } else if (type == 'dth') {
      return this.rechargeComponent('DTH');
    } else if (type == 'transfer_beneficiary') {
      return this.moneyTransferComponent();
    } else if (type == 'wallet_request') {
      return this.walletRequestHistoryComponent();
    } else if (type == 'settlement') {
      return this.settlementHistoryComponent();
    } else if (type == 'Vehicle Commission History') {
      return this.vehicleInsuranceComponent();
    } else if (type == 'Health Commission History') {
      return this.healthandTravelInsuranceComponent();
    } else if (type == 'Travel Commission History') {
      return this.healthandTravelInsuranceComponent(); // both health commission and travel has same datas
    } else if (type == 'Fastag Registration History') {
      return this.fastagRegistrationComponent();
    } else if (type == 'Fastag Recharge History') {
      return this.fastagRechargeComponent();
    }
    else if (type == 'Fastag Recharge Icici History') {
      return this.fastagRechargeIciciComponent();
    }
    else if (type == 'TeacherInd Registration History') {
      return this.teacherIndRegistrationComponent();
    } else if (type == 'AEPS Transaction History') {
      return this.AEPSComponent();
    } else if (type == 'alltransaction') {
      return this.allHistoryComponent();
    }
    else if (type=='Agent Dashboard History')
    {
      return this.allHistoryComponent();
    }
    else {
      return null;
    }
  }

  settlementHistoryComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(90) : normalize(150),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}
        disabled={true}>
        <View style={{flex: 16}}>
          {/* <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 7, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                  Account Name :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800", color: "black" }}
                >
                  {data.bankaccountname
                    ? data.bankaccountname.toUpperCase()
                    : ""}
                </Text>
              </View>
            </View>
          </View> */}

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 7, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date of Settlement :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 7, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Time :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.time ? data.time : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 7, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount
                    ? data.servicecharge &&
                      data.servicecharge !== '' &&
                      data.servicecharge !== '0'
                      ? data.amount + ' + ' + data.servicecharge + '(S.Ch)'
                      : data.amount
                      ? data.amount
                      : ''
                    : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 7, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.status && data.status == 'Rejected'
                        ? '#B40404'
                        : data.status.toLowerCase() == 'approved'
                        ? '#04B404'
                        : '#B45F04',
                  }}>
                  {data.status ? data.status.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* <View
          style={{
            flex: 2,
            justifyContent: "flex-start",
            alignItems: "flex-end",
            backgroundColor: "#fff"
          }}
        >
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? "keyboard-arrow-down"
                : "keyboard-arrow-up"
            }
          />
        </View> */}
      </TouchableOpacity>
    );
  }

  iciciComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        disabled={true}
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 7,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: normalize(70),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          {/* <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                  TID :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800", color: "black" }}
                >
                  {data.details && data.details.data && data.details.data.tid
                    ? data.details.data.tid
                    : ""}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                  MID :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800", color: "black" }}
                >
                  {data.details && data.details.data && data.details.data.mid
                    ? data.details.data.mid
                    : ""}
                </Text>
              </View>
            </View>
          </View> */}

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Paid Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data && data.credate1 ? data.credate1 : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Card No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.details &&
                  data.details.data &&
                  data.details.data.cardNum
                    ? data.details.data.cardNum
                    : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={this.state.clicked ? 3 : 1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.details &&
                  data.details.data &&
                  data.details.data.transAmount
                    ? data.details.data.transAmount
                    : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            backgroundColor: '#fff',
          }}>
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            //name={data.address.length<21?'':this.state.clicked==false?"keyboard-arrow-down":'keyboard-arrow-up'}
          />
        </View>
      </TouchableOpacity>
    );
  }

  AEPSComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(140) : normalize(250),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        disabled={true}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Transaction Type :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.txntype ? data.txntype : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 3,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Transaction ID :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={3}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.transactionId ? data.transactionId : ''}
                </Text>
              </View>
            </View>
          </View>
          {/* <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                  Institution :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800" }}
                >
                  {data.course_institution ? data.course_institution : ""}
                </Text>
              </View>
            </View>
          </View> */}

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount ? data.amount : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Semester :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '800',
                    color:
                      data.txnstatus &&
                      data.txnstatus.toLowerCase() == 'pending'
                        ? '#B45F04'
                        : data.txnstatus.toLowerCase() == 'success'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.txnstatus
                    ? data.txnstatus.toLowerCase() == 'success'
                      ? 'SUCCESS'
                      : 'FAILED'
                    : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* <View
          style={{
            flex: 2,
            justifyContent: "flex-start",
            alignItems: "flex-end",
            backgroundColor: "#fff",
          }}
        >
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? "keyboard-arrow-down"
                : "keyboard-arrow-up"
            }
          />
        </View> */}
      </TouchableOpacity>
    );
  }

  mahagramComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        disabled={true}
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 7,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: normalize(70),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          {/* <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                  TID :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800", color: "black" }}
                >
                  {data.details && data.details.data && data.details.data.tid
                    ? data.details.data.tid
                    : ""}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                  MID :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800", color: "black" }}
                >
                  {data.details && data.details.data && data.details.data.mid
                    ? data.details.data.mid
                    : ""}
                </Text>
              </View>
            </View>
          </View> */}

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Paid Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data && data.credate1 ? data.credate1 : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Card No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.details && data.details.data && data.details.data.cardno
                    ? data.details.data.cardno
                    : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={this.state.clicked ? 3 : 1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.details &&
                  data.details.data &&
                  data.details.data.txnamount
                    ? data.details.data.txnamount
                    : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            backgroundColor: '#fff',
          }}>
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            //name={data.address.length<21?'':this.state.clicked==false?"keyboard-arrow-down":'keyboard-arrow-up'}
          />
        </View>
      </TouchableOpacity>
    );
  }

  Component() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        disabled={true}
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: normalize(140),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.name ? data.name : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Mobile :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.mobileno ? data.mobileno : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Paid Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.paiddate && data.paiddate !== ''
                    ? moment(data.paiddate, 'YYYY-MM-DD').format('DD-MM-YYYY')
                    : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Order Id :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.orderid ? data.orderid : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={this.state.clicked ? 3 : 1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount ? data.amount : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.status && data.status.toLowerCase() == 'pending'
                        ? '#B45F04'
                        : data.status.toLowerCase() == 'success'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.status ? data.status.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>

          {data.status.toLowerCase() == 'failed' && data.refund_status && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Refund Status :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.refund_status ? data.refund_status : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            backgroundColor: '#fff',
          }}>
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            //name={data.address.length<21?'':this.state.clicked==false?"keyboard-arrow-down":'keyboard-arrow-up'}
          />
        </View>
      </TouchableOpacity>
    );
  }

  adminPanelComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <View
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: normalize(120),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,

          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}>
        <View style={{flex: 4, backgroundColor: '#fff'}} />
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              style={{
                height: '90%',
                width: '97%',
                backgroundColor: 'green',
                borderRadius: 5,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{flex: 5, alignItems: 'center'}}>
                <Text style={{color: '#fff', fontSize: 18}}>Approve</Text>
              </View>
              {/* <View style={{flex:2,alignItems:'center'}}>
            <Icon
            color="#fff"
            size={26}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
             'check'
            }
          />
          </View> */}
            </TouchableOpacity>
          </View>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              style={{
                height: '90%',
                width: '97%',
                backgroundColor: 'red',
                borderRadius: 5,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{color: '#fff', fontSize: 18, alignSelf: 'center'}}>
                  Deny
                </Text>
              </View>
              {/* <View style={{flex:2,alignItems:'center'}}>
              <Icon
              color="#fff"
              size={26}
              type="materialicons"
              underlayColor="rgba(255,255,255,0)"
              name={
               'close'
              }
            />
            </View> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  allHistoryComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        disabled={true}
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(120) : normalize(170),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 3, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Type :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 14, fontWeight: '800', color: 'black'}}>
                  {data.redumssion ? data.redumssion : ''}
                </Text>
              </View>
            </View>
          </View>

          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 3, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    IFSC Code :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.ifsc ? data.ifsc : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 3, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Purpose :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.purpose ? data.purpose : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 3, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 3, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Time :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.time
                    ? moment(data.time, 'hh:mm a').format('hh:mm a')
                    : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 3, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount ? data.amount : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 3, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Pay Type :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '800',
                    color: data.paytype == 'Credit' ? '#B40404' : '#04B404',
                  }}>
                  {data.paytype ? data.paytype : ''}
                </Text>
              </View>
            </View>
          </View>
          {/* <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                  Status :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{
                    fontSize: 16,
                    fontWeight: "1200",
                    color:
                      data.status && data.status == "pending"
                        ? "#B45F04"
                        : data.status.toLowerCase() == "success"
                        ? "#04B404"
                        : "#B40404"
                  }}
                >
                  {data.status ? data.status.toUpperCase() : ""}
                </Text>
              </View>
            </View>
          </View> */}
        </View>
        {/* <View
          style={{
            flex: 2,
            justifyContent: "flex-start",
            alignItems: "flex-end",
            backgroundColor: "#fff"
          }}
        >
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            // name={
            //   this.state.clicked == false
            //     ? "keyboard-arrow-down"
            //     : "keyboard-arrow-up"
            // }
          />
        </View> */}
      </TouchableOpacity>
    );
  }

  walletRequestHistoryComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(120) : normalize(150),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}
        disabled={true}>
        <View style={{flex: 16}}>
          {/* <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 7, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                  Account Name :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800", color: "black" }}
                >
                  {data.bankaccountname
                    ? data.bankaccountname.toUpperCase()
                    : ""}
                </Text>
              </View>
            </View>
          </View> */}
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 7, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Type :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.type_of_deposit ? data.type_of_deposit : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 7, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Message :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.remarks ? data.remarks : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 7, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date of Payment :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.date_of_deposit ? data.date_of_deposit : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 7, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Bank Reference Number :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.reference ? data.reference : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 7, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount ? data.amount : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 7, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.status && data.status == 'pending'
                        ? '#B45F04'
                        : data.status.toLowerCase() == 'success'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.status ? data.status.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* <View
          style={{
            flex: 2,
            justifyContent: "flex-start",
            alignItems: "flex-end",
            backgroundColor: "#fff"
          }}
        >
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? "keyboard-arrow-down"
                : "keyboard-arrow-up"
            }
          />
        </View> */}
      </TouchableOpacity>
    );
  }

  moneyTransferComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(145) : normalize(170),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.bankaccountname
                    ? data.bankaccountname.toUpperCase()
                    : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Account no :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.bankaccountno ? data.bankaccountno : ''}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    IFSC Code :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.ifsc ? data.ifsc : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Branch name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.branch ? data.branch : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Bank :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.bankname ? data.bankname : ''}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Purpose :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.purpose ? data.purpose : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount ? data.amount : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Time :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.time ? moment(data.time, 'his').format('HH:mm') : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.status && data.status == 'pending'
                        ? '#B45F04'
                        : data.status.toLowerCase() == 'success'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.status ? data.status.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            backgroundColor: '#fff',
          }}>
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? 'keyboard-arrow-down'
                : 'keyboard-arrow-up'
            }
          />
        </View>
      </TouchableOpacity>
    );
  }

  travelInsuranceComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(145) : normalize(170),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.bankaccountname
                    ? data.bankaccountname.toUpperCase()
                    : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Account no :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.bankaccountno ? data.bankaccountno : ''}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    IFSC Code :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.ifsc ? data.ifsc : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Branch name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.branch ? data.branch : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Bank :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.bankname ? data.bankname : ''}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Purpose :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.purpose ? data.purpose : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount ? data.amount : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Time :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.time ? moment(data.time, 'his').format('HH:mm') : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.status && data.status == 'pending'
                        ? '#B45F04'
                        : data.status.toLowerCase() == 'approved'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.status ? data.status.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            backgroundColor: '#fff',
          }}>
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? 'keyboard-arrow-down'
                : 'keyboard-arrow-up'
            }
          />
        </View>
      </TouchableOpacity>
    );
  }

  healthandTravelInsuranceComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(175) : normalize(170),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        disabled={true}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.customer_name ? data.customer_name.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Company :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.company ? data.company : ''}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    IFSC Code :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.ifsc ? data.ifsc : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Customer Number :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.customer_number ? data.customer_number : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Policy No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.policy_no ? data.policy_no : ''}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Purpose :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.purpose ? data.purpose : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  TrackID :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.trackid ? data.trackid : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount ? data.amount : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Commission :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.commission ? data.commission : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.status && data.status == 'pending'
                        ? '#B45F04'
                        : data.status.toLowerCase() == 'approved'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.status ? data.status.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* <View
          style={{
            flex: 2,
            justifyContent: "flex-start",
            alignItems: "flex-end",
            backgroundColor: "#fff",
          }}
        >
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? "keyboard-arrow-down"
                : "keyboard-arrow-up"
            }
          />
        </View> */}
      </TouchableOpacity>
    );
  }

  fastagRegistrationComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(175) : normalize(250),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.name ? data.name.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Mobile No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.mobile_no ? data.mobile_no : ''}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Paytm No :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.paytmno ? data.paytmno : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View
            style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Vehicle No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.vehicle_no ? data.vehicle_no : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Vehicle Class :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.vehicle_class ? data.vehicle_class : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Fastag No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.fasttag_no ? data.fasttag_no : ''}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Address :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.address ? data.address : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Commercial Type :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.commercial_type ? data.commercial_type : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Joining Fee :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.JoiningFee ? data.JoiningFee : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.totalAmount ? data.totalAmount : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.status && data.status.toLowerCase() == 'pending'
                        ? '#B45F04'
                        : data.status.toLowerCase() == 'approved'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.status ? data.status.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            backgroundColor: '#fff',
          }}>
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? 'keyboard-arrow-down'
                : 'keyboard-arrow-up'
            }
          />
        </View>
      </TouchableOpacity>
    );
  }


  
  fastagRechargeIciciComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(135) : normalize(200),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        disabled={true}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.name ? data.name.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Mobile No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.mobile_no ? data.mobile_no : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Vehicle No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.vehicle_no ? data.vehicle_no : ''}
                </Text>
              </View>
            </View>
          </View>

          

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount ? data.amount : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.status && data.status.toLowerCase() == 'pending'
                        ? '#B45F04'
                        : data.status.toLowerCase() == 'approved'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.status ? data.status.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* <View
          style={{
            flex: 2,
            justifyContent: "flex-start",
            alignItems: "flex-end",
            backgroundColor: "#fff",
          }}
        >
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? "keyboard-arrow-down"
                : "keyboard-arrow-up"
            }
          />
        </View> */}
      </TouchableOpacity>
    );
  }

  fastagRechargeComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(175) : normalize(250),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        disabled={true}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.name ? data.name.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Mobile No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.mobile_no ? data.mobile_no : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Vehicle No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.vehicle_no ? data.vehicle_no : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Vehicle Class :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.vehicle_class ? data.vehicle_class : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Fastag No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.fasttag_no ? data.fasttag_no : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Address :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={2}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.address ? data.address : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount ? data.amount : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.status && data.status.toLowerCase() == 'pending'
                        ? '#B45F04'
                        : data.status.toLowerCase() == 'approved'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.status ? data.status.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* <View
          style={{
            flex: 2,
            justifyContent: "flex-start",
            alignItems: "flex-end",
            backgroundColor: "#fff",
          }}
        >
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? "keyboard-arrow-down"
                : "keyboard-arrow-up"
            }
          />
        </View> */}
      </TouchableOpacity>
    );
  }

  teacherIndRegistrationComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(130) : normalize(250),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        disabled={true}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.name ? data.name.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Mobile No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.mobile ? data.mobile : ''}
                </Text>
              </View>
            </View>
          </View>

          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Email Id :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.email ? data.email : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {/* <View
            style={{
              flex: 2,
              flexDirection: "row",
              backgroundColor: "#fff",
            }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                  Address :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={2}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800" }}
                >
                  {data.address ? data.address : ""}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                District :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800" }}
                >
                  {data.district ? data.district : ""}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
          <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                Taluk :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800" }}
                >
                  {data.taluk ? data.taluk : ""}
                </Text>
              </View>
            </View>
          </View>
          
          )} */}

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Course Name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.course_name ? data.course_name : ''}
                </Text>
              </View>
            </View>
          </View>
          {/* <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                  Institution :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800" }}
                >
                  {data.course_institution ? data.course_institution : ""}
                </Text>
              </View>
            </View>
          </View> */}
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Semester :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.course_semester ? data.course_semester : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Tution For :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.course_tutionfor ? data.course_tutionfor : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* <View
          style={{
            flex: 2,
            justifyContent: "flex-start",
            alignItems: "flex-end",
            backgroundColor: "#fff",
          }}
        >
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? "keyboard-arrow-down"
                : "keyboard-arrow-up"
            }
          />
        </View> */}
      </TouchableOpacity>
    );
  }

  vehicleInsuranceComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(175) : normalize(200),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.customer_name ? data.customer_name.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Company :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.company ? data.company : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  TrackID :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.trackid ? data.trackid : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Policy No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.policy_no ? data.policy_no : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Vehicle Type :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.vehicle_type ? data.vehicle_type : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Vehicle No :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.vehicleno ? data.vehicleno : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>

          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    OD :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.od ? data.od : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {this.state.clicked && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    TP :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.tp ? data.tp : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Total Premium :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.totalpremium ? data.totalpremium : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Commission :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.commission ? data.commission : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.status && data.status == 'pending'
                        ? '#B45F04'
                        : data.status.toLowerCase() == 'approved'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.status ? data.status.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            backgroundColor: '#fff',
          }}>
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? 'keyboard-arrow-down'
                : 'keyboard-arrow-up'
            }
          />
        </View>
      </TouchableOpacity>
    );
  }

  rechargeComponent(value) {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        disabled={true}
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: this.state.clicked == false ? normalize(135) : normalize(170),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  {value == 'MOBILE' ? 'Mobile No :' : 'Customer ID :'}
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {value == 'MOBILE'
                    ? data.recharge_number
                    : data.recharge_number}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Provider :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.provider ? data.provider : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Type :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.service_type ? data.service_type : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Time :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.time ? data.time : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount ? data.amount : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.recharge_status && data.recharge_status == 'pending'
                        ? '#B45F04'
                        : data.recharge_status.toLowerCase() == 'success'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.recharge_status
                    ? data.recharge_status.toUpperCase()
                    : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            backgroundColor: '#fff',
          }}>
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            // name={this.state.clicked==false?"keyboard-arrow-down":'keyboard-arrow-up'}
          />
        </View>
      </TouchableOpacity>
    );
  }

  bsnlComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        disabled={true}
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: data.refId?normalize(220):normalize(200),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,

          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-end',
          }}>
          <View style={{padding: 5, marginRight: 8}}>
            {this.state.pdf_download_loading == true ? (
              <ActivityIndicator size={'small'} color={'#528FF3'} />
            ) : (
              <Icon
                color="#528FF3"
                size={19}
                type="feather"
                name={'download'}
                onPress={() => {
                  this.setState(
                    {
                      downloadPayload: data.trackid ? data.trackid : '',
                      pdf_download_loading: true,
                    },
                    () => {
                      this.downloadFile(data.credate, 'download', 'bsnl');
                    },
                  );
                }}
              />
            )}
          </View>
          <View style={{marginleft: 8, padding: 5}}>
            {this.state.pdf_share_loading == true ? (
              <ActivityIndicator size={'small'} color={'#528FF3'} />
            ) : (
              <Icon
                color="#528FF3"
                size={19}
                name={'share'}
                type={'entypo'}
                onPress={() => {
                  this.setState(
                    {
                      downloadPayload: data.trackid ? data.trackid : '',
                      pdf_share_loading: true,
                    },
                    () => {
                      this.downloadFile(data.credate, 'share', 'bsnl');
                    },
                  );
                }}
              />
            )}
          </View>
        </View>
        <View style={{flexDirection: 'row', flex: 10, width: '100%'}}>
          <View style={{flex: 16}}>
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Name :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.name ? data.name : ''}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Mobile :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.mobile ? data.mobile : ''}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Landline No :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.landline_no ? data.landline_no : ''}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Provider :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={this.state.clicked ? 3 : 1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.provider ? data.provider : ''}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Type :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.connection_type ? data.connection_type : ''}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Account No :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.account_no ? data.account_no : ''}
                  </Text>
                </View>
              </View>
            </View>
            {data.refId &&(
            <View
              style={{
                flex: 2,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Ref ID :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.refId ? data.refId : ''}
                  </Text>
                </View>
              </View>
            </View>
            )}
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Date :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.credate ? data.credate : ''}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Amount :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.amount
                      ? data.service_charge && data.service_charge !== ''
                        ? data.amount + ' + ' + data.service_charge + '(S.Ch)'
                        : data.amount
                        ? data.amount
                        : ''
                      : ''}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Status :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{
                      fontSize: 16,
                      fontWeight: '1200',
                      color:
                        data.status && data.status.toLowerCase() == 'pending'
                          ? '#FF8C00'
                          : data.status.toLowerCase() == 'success'
                          ? '#04B404'
                          : '#B40404',
                    }}>
                    {data.status ? data.status.toUpperCase() : ''}
                  </Text>
                </View>
              </View>
            </View>

            {data.status.toLowerCase() == 'failed' && data.refund_status && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: '#fff',
                }}>
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 5, overflow: 'hidden'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                      Refund Status :
                    </Text>
                  </View>
                  <View style={{flex: 9, overflow: 'hidden'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={{fontSize: 16, fontWeight: '800'}}>
                      {data.refund_status ? data.refund_status : ''}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              flex: 2,
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              backgroundColor: '#fff',
            }}>
            <Icon
              color="#757575"
              size={24}
              type="materialicons"
              underlayColor="rgba(255,255,255,0)"
              //name={data.address.length<21?'':this.state.clicked==false?"keyboard-arrow-down":'keyboard-arrow-up'}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  asianetComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height:
            this.state.clicked == false
              ? data.status.toLowerCase() == 'failed'
                ? normalize(170)
                : normalize(160)
              : data.status.toLowerCase() == 'failed'
              ? normalize(205)
              : normalize(200),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View style={{flex: 16}}>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Name :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.name ? data.name : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Mobile :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.mobile ? data.mobile : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Subscriber ID :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.subscriberid ? data.subscriberid : ''}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Provider Type :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                  {data.type ? data.type : ''}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Address :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.address ? data.address : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Date :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.credate ? data.credate : ''}
                </Text>
              </View>
            </View>
          </View>
          {this.state.clicked && (
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Time :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.time ? data.time : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Amount :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{fontSize: 16, fontWeight: '800'}}>
                  {data.amount
                    ? data.service_charge && data.service_charge !== ''
                      ? data.amount + ' + ' + data.service_charge + '(S.Ch)'
                      : data.amount
                      ? data.amount
                      : ''
                    : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingRight: 4,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 5, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                  Status :
                </Text>
              </View>
              <View style={{flex: 9, overflow: 'hidden'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: 16,
                    fontWeight: '1200',
                    color:
                      data.status && data.status.toLowerCase() == 'pending'
                        ? '#B45F04'
                        : data.status.toLowerCase() == 'success'
                        ? '#04B404'
                        : '#B40404',
                  }}>
                  {data.status ? data.status.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </View>

          {data.status.toLowerCase() == 'failed' && (
            <View
              style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Refund Status :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.refund_status ? data.refund_status : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            backgroundColor: '#fff',
          }}>
          <Icon
            color="#757575"
            size={24}
            type="materialicons"
            underlayColor="rgba(255,255,255,0)"
            name={
              this.state.clicked == false
                ? 'keyboard-arrow-down'
                : 'keyboard-arrow-up'
            }
          />
        </View>
      </TouchableOpacity>
    );
  }

  ksebComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;

    return (
      <TouchableOpacity
        disabled={true}
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height:
            this.state.clicked == false
              ? data.status.toLowerCase() == 'failed'
                ?data.refId? normalize(195):normalize(175)
                :data.refId? normalize(185): normalize(165)
              : data.status.toLowerCase() == 'failed'
              ? normalize(190)
              : normalize(185),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,

          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-end',
          }}>
          <View style={{padding: 5, marginRight: 8}}>
            {this.state.pdf_download_loading == true ? (
              <ActivityIndicator size={'small'} color={'#528FF3'} />
            ) : (
              <Icon
                color="#528FF3"
                size={19}
                type="feather"
                name={'download'}
                onPress={() => {
                  this.setState(
                    {
                      downloadPayload: data.trackid ? data.trackid : '',
                      pdf_download_loading: true,
                    },
                    () => {
                      this.downloadFile(
                        data.credate,
                        'download',
                        this.props.type,
                      );
                    },
                  );
                }}
              />
            )}
          </View>
          <View style={{marginleft: 8, padding: 5}}>
            {this.state.pdf_share_loading == true ? (
              <ActivityIndicator size={'small'} color={'#528FF3'} />
            ) : (
              <Icon
                color="#528FF3"
                size={19}
                name={'share'}
                type={'entypo'}
                onPress={() => {
                  this.setState(
                    {
                      downloadPayload: data.trackid ? data.trackid : '',
                      pdf_share_loading: true,
                    },
                    () => {
                      this.downloadFile(data.credate, 'share', this.props.type);
                    },
                  );
                }}
              />
            )}
          </View>
        </View>
        <View style={{flexDirection: 'row', flex: 10, width: '100%'}}>
          <View style={{flex: 16}}>
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Name :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.name ? data.name : ''}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Mobile :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.mobile ? data.mobile : ''}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Consumer ID :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.consumerid ? data.consumerid : ''}
                  </Text>
                </View>
              </View>
            </View>
            {data.refId &&(
            <View
              style={{
                flex: 2,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Ref ID :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.refId ? data.refId : ''}
                  </Text>
                </View>
              </View>
            </View>
            )}
            <View
              style={{
                flex: this.state.clicked ? 4 : 1,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Place :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={this.state.clicked ? 3 : 1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.place ? data.place : ''}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Date :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.credate ? data.credate : ''}
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
                  <Text numberOfLines={1} ellipsizeMode={'tail'}  style={{alignSelf:'flex-start',color:'#2E2E2E'}}>Time :</Text>
                </View>
                <View style={{ flex: 9 ,overflow:'hidden'}}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 16, fontWeight: "800" }}>
                    {data.time?data.time:''}
                  </Text>
                </View>
              </View>
            </View> */}
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Amount :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.amount
                      ? data.service_charge && data.service_charge !== ''
                        ? data.amount + ' + ' + data.service_charge + '(S.Ch)'
                        : data.amount
                        ? data.amount
                        : ''
                      : ''}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Status :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{
                      fontSize: 16,
                      fontWeight: '1200',
                      color:
                        data.status && data.status.toLowerCase() == 'pending'
                          ? '#B45F04'
                          : data.status.toLowerCase() == 'success'
                          ? '#04B404'
                          : '#B40404',
                    }}>
                    {data.status ? data.status.toUpperCase() : ''}
                  </Text>
                </View>
              </View>
            </View>

            {data.status.toLowerCase() == 'failed' && data.refund_status && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: '#fff',
                }}>
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 5, overflow: 'hidden'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                      Refund Status :
                    </Text>
                  </View>
                  <View style={{flex: 9, overflow: 'hidden'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={{fontSize: 16, fontWeight: '800'}}>
                      {data.refund_status ? data.refund_status : ''}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              flex: 2,
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              backgroundColor: '#fff',
            }}>
            <Icon
              color="#757575"
              size={24}
              type="materialicons"
              underlayColor="rgba(255,255,255,0)"
              //name={data.address.length<21?'':this.state.clicked==false?"keyboard-arrow-down":'keyboard-arrow-up'}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  waterAuthorityComponent() {
    let {data, dataLength, max_datalength, page_Depth} = this.props;
    const {boxDimension, showPassword} = this.state;
    return (
      <TouchableOpacity
        disabled={true}
        //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
        style={{
          marginBottom: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          height: data.refId?normalize(200):normalize(180),
          width: '96%',
          backgroundColor: '#fff',
          alignSelf: 'center',
          borderWidth: 1,

          marginBottom: 10,
          borderColor: '#c0c0c8',
          borderRadius: 8,
        }}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({clicked: !this.state.clicked});
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-end',
          }}>
          <View style={{padding: 5, marginRight: 8}}>
            {this.state.pdf_download_loading == true ? (
              <ActivityIndicator size={'small'} color={'#528FF3'} />
            ) : (
              <Icon
                color="#528FF3"
                size={19}
                type="feather"
                name={'download'}
                onPress={() => {
                  this.setState(
                    {
                      downloadPayload: data.trackid ? data.trackid : '',
                      pdf_download_loading: true,
                    },
                    () => {
                      this.downloadFile(data.credate, 'download', 'water_auth');
                    },
                  );
                }}
              />
            )}
          </View>
          <View style={{marginleft: 8, padding: 5}}>
            {this.state.pdf_share_loading == true ? (
              <ActivityIndicator size={'small'} color={'#528FF3'} />
            ) : (
              <Icon
                color="#528FF3"
                size={19}
                name={'share'}
                type={'entypo'}
                onPress={() => {
                  this.setState(
                    {
                      downloadPayload: data.trackid ? data.trackid : '',
                      pdf_share_loading: true,
                    },
                    () => {
                      this.downloadFile(data.credate, 'share', 'water_auth');
                    },
                  );
                }}
              />
            )}
          </View>
        </View>
        <View style={{flexDirection: 'row', flex: 10, width: '100%'}}>
          <View style={{flex: 16}}>
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Name :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.name ? data.name : ''}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Mobile :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.mobile ? data.mobile : ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* <View
            style={{ flex: 1, paddingRight:4,flexDirection: "row", backgroundColor: "#fff" }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 5, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ alignSelf: "flex-start", color: "#2E2E2E" }}
                >
                  Consumer ID :
                </Text>
              </View>
              <View style={{ flex: 9, overflow: "hidden" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ fontSize: 16, fontWeight: "800", color: "black" }}
                >
                  {data.consumerid ? data.consumerid : ""}
                </Text>
              </View>
            </View>
          </View> */}
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Bill No :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.billno ? data.billno : ''}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Consumer No :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.consumerno ? data.consumerno : ''}
                  </Text>
                </View>
              </View>
            </View>
            {data.refId &&(
            <View
              style={{
                flex: 2,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Ref ID :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800', color: 'black'}}>
                    {data.refId ? data.refId : ''}
                  </Text>
                </View>
              </View>
            </View>
            )}
            <View
              style={{
                flex: this.state.clicked ? 4 : 1,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    section :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={this.state.clicked ? 3 : 1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.section ? data.section : ''}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Date :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.credate ? data.credate : ''}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Amount :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{fontSize: 16, fontWeight: '800'}}>
                    {data.amount
                      ? data.service_charge && data.service_charge !== ''
                        ? data.amount + ' + ' + data.service_charge + '(S.Ch)'
                        : data.amount
                        ? data.amount
                        : ''
                      : ''}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingRight: 4,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 5, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                    Status :
                  </Text>
                </View>
                <View style={{flex: 9, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{
                      fontSize: 16,
                      fontWeight: '1200',
                      color:
                        data.status && data.status.toLowerCase() == 'pending'
                          ? '#B45F04'
                          : data.status.toLowerCase() == 'success'
                          ? '#04B404'
                          : '#B40404',
                    }}>
                    {data.status ? data.status.toUpperCase() : ''}
                  </Text>
                </View>
              </View>
            </View>

            {data.status.toLowerCase() == 'failed' && data.refund_status && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: '#fff',
                }}>
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 5, overflow: 'hidden'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={{alignSelf: 'flex-start', color: '#2E2E2E'}}>
                      Refund Status :
                    </Text>
                  </View>
                  <View style={{flex: 9, overflow: 'hidden'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={{fontSize: 16, fontWeight: '800'}}>
                      {data.refund_status ? data.refund_status : ''}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              flex: 2,
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              backgroundColor: '#fff',
            }}>
            <Icon
              color="#757575"
              size={24}
              type="materialicons"
              underlayColor="rgba(255,255,255,0)"
              //name={data.address.length<21?'':this.state.clicked==false?"keyboard-arrow-down":'keyboard-arrow-up'}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state) => ({
  authorization: state.authorization,
});

export default connect(mapStateToProps)(HistoryComponent);
