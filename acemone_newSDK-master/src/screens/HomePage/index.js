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
  Alert,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { Icon, Input } from "react-native-elements";
import NavigatorService from "../../router/NavigatorService";
import Orientation from "react-native-orientation";
import MainButton from "../../components/MainButton";
import HomeHeader from "./Header";
import HomeComponent from "./HomeComponent";
import { DrawerActions } from "react-navigation-drawer";
import { getServiceList, getSubServicesList } from "../../actions/login";
import DrawerComponent from "../../router/DrawerComponent";
import Drawer from "react-native-drawer";
import CenterLoading from "../../components/CenterLoading";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import Profile from "../Profile";
import Login from "../LoginPage/LoginPassword";
import HomeScreen from "../HomePage/HomePage";
//import PreLogin from "../screens/PreLoginPage";
import Settings from "../Settings/index";
import History from "../History/History";
import AdminPanel from '../AdminPanel'
import CustomDrawer from "../../router/CustomDrawer";


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const HomeList = createDrawerNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: `${"Home"}`,
        drawerIcon: ({ tintColor }) => (
          <Icon
            name="home"
            type="material-community"
            size={24}
            color="#ffffff90"
          />
        )
      })
    },
    ProfileScreen: {
      screen: Profile,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: `${"Profile"}`,
        drawerIcon: ({ tintColor }) => (
          <Icon
            name="account"
            type="material-community"
            size={26}
            color="#fff"
          />
        )
      })
    },
    AdminPanelScreen: {
      screen: AdminPanel,
      params: { page: "adminPanel", title: "Admin Panel" },

      navigationOptions: ({ navigation }) => ({
        drawerLabel: `${"Admin Panel"}`,
        drawerIcon: ({ tintColor }) => (
          <Icon name="carryout" type="antdesign" size={24}   color="#fff"/>
        )
      })
    },
    HistoryScreen: {
      screen: History,
      params: { page: "allhistory", title: "Transaction History" },

      navigationOptions: ({ navigation }) => ({
        drawerLabel: `${"Transaction History"}`,
        drawerIcon: ({ tintColor }) => (
          <Icon name="info" type="entypo" size={24}   color="#fff"/>
        )
      })
    },
    SettingsScreen: {
      screen: Settings,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: `${"Settings"}`,
        drawerIcon: ({ tintColor }) => (
          <Icon
            name="settings"
            type="material-community"
            size={24}
            color="#fff"
          />
        )
      })
    }
  },

  {overlayColor:'transparent',
    contentComponent: props => <CustomDrawer {...props} />,
    contentOptions: {
      labelStyle: { fontSize: 19, fontWeight: "500" }
    },
//     defaultNavigationOptions: {
//       drawerLockMode: 'locked-closed',
//  }
  }
);

const AppNav = createAppContainer(HomeList);

class AppNavScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      keyboardOpen: false,
      boxDimension: 0,
      username: "",
      mpinpassword: "",
      servicesData: [],

      settingsLoading: false,
      pageDepth: []
    };
  }
  componentDidMount() {
    Orientation.lockToPortrait();
    this.setState({ settingsLoading: true }, () => {
      getServiceList()
        .then(result => {
          if (result.data && result.data.length > 0) {
            this.setState({
              servicesData: result.data,
              settingsLoading: false
            });
          }
        })
        .catch(err => {
          this.setState({ settingsLoading: false });
          console.log("Error", err.response);
        });
    });

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
          height:'100%',
          backgroundColor: "#ffff"
        }}
      >
        <AppNav />
      </SafeAreaView>
    );
  }
}

// class HomeScreen extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       showPassword: false,
//       keyboardOpen: false,
//       boxDimension: 0,
//       username: "",
//       mpinpassword: "",
//       servicesData: [],

//       settingsLoading: false,
//       pageDepth: []
//     };
//   }
//   componentDidMount() {
//     Orientation.lockToPortrait();
//     this.setState({ settingsLoading: true }, () => {
//       getServiceList()
//         .then(result => {
//           if (result.data && result.data.length > 0) {
//             this.setState({
//               servicesData: result.data,
//               settingsLoading: false
//             });
//           }
//         })
//         .catch(err => {
//           this.setState({ settingsLoading: false });
//           console.log("Error", err.response);
//         });
//     });

//     this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
//       this.setState({ keyboardOpen: true })
//     );
//     this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
//       this.setState({ keyboardOpen: false })
//     );
//   }

//   componentWillUnmount() {
//     //Orientation.unlockAllOrientations();
//     this.keyboardDidShowListener.remove();
//     this.keyboardDidHideListener.remove();
//   }

//   render() {
//     const { boxDimension, showPassword } = this.state;
//     return (
//       <SafeAreaView
//         style={{
//           flex: 1,
//           backgroundColor: "#ffff"
//         }}
//       >
//         <Drawer
//           ref={ref => (this._drawer = ref)}
//           content={<DrawerComponent {...this.props} />}
//           side="left"
//           captureGestures
//           openDrawerOffset={0.4}
//           acceptTap={false}
//           acceptPan={false}
//         >
//           <View style={{ width: "100%", flex: 1 }}>
//             <HomeHeader
//               iconName="menu"
//               iconType="material-community"
//               iconColor={"#32272B"}
//               //iconSize={32}
//               onIconPress={() => {
//                 //this._drawer.toggle();
//                 this.props.navigation.opneDrawer()
//                 console.log(this.props.navigation.state);
//               }}
//               titleLabel={""}
//               titleColor={"#32272B"}
//               backgroundColor={"#fff"}
//               titleLabel={"CATEGORIES"}
//             />
//           </View>

//           <View style={{ flex: 8, width: "100%", paddingVertical: 2 }}>
//             <FlatList
//               contentContainerStyle={{ paddingTop: "5%" }}
//               data={this.state.servicesData}
//               renderItem={({ item, index, separators }) => (
//                 <HomeComponent
//                   onClickFunction={() => {
//                     if (item.id ) {
//                       getSubServicesList(item.id)
//                         .then(result => {
//                           if (result.data && result.data.length > 0) {
//                             // this.setState({ servicesData: result.data ,settingsLoading:false});
//                             console.log(result, "bbbbb");
//                             if (result.data && result.data.length > 0) {
//                               let pageDepth=this.state.pageDepth
//                               pageDepth.push(item.id);
//                               this.setState({pageDepth},()=>{

//                                   console.log(this.state.pageDepth,'here111')
//                                     this.setState({serviceData:result.data})

//                               })
//                             }

//                           }
//                         })
//                         .catch(err => {
//                           this.setState({ settingsLoading: false });
//                           console.log("Error", err.response);
//                         });
//                     }
//                   }}
//                   data={item}
//                 />
//               )}
//             />
//           </View>
//         </Drawer>
//         {this.state.settingsLoading && <CenterLoading color={"black"} />}
//       </SafeAreaView>
//     );
//   }
// }

const mapStateToProps = state => ({
  authorization: state.authorization
});

export default connect(mapStateToProps)(AppNavScreen);
