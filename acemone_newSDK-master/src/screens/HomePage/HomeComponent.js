import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableOpacity,
  Platform,
  Text,
  FlatList,Dimensions, PixelRatio
} from 'react-native';
import {connect} from 'react-redux';
import {Icon, Input} from 'react-native-elements';
import NavigatorService from '../../router/NavigatorService';
import Orientation from 'react-native-orientation';
import MainButton from '../../components/MainButton';


const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
  const newSize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}



class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword:false,
      keyboardOpen: false,
      boxDimension: 0,
      username: '',
      mpinpassword: '',
    };
  }
  componentDidMount() {
    Orientation.lockToPortrait();

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

  render() {
    let {data,dataLength,max_datalength,page_Depth,componentTextColor}=this.props;
    const {boxDimension,showPassword} = this.state;
    console.log(dataLength,this.props.max_datalength)
    let pageDepthColor=['#244115','#e03e3a82','#2C4259']
    return (
    
    <TouchableOpacity
      onPress={() => this.props.onClickFunction()}
      //style={{height:dataLength && dataLength>=max_datalength?normalize(140):290,width:dataLength && dataLength>=max_datalength?normalize(140):290,backgroundColor:'#fff',margin:10,alignSelf:'center',borderWidth:1,borderColor:'grey',borderRadius:8,
      //style={{height:normalize(80),width:'100%',backgroundColor:'#fff',alignSelf:'center',borderTopWidth:1,borderColor:'#c0c0c874',flexDirection:'row',marginBottom:0,paddingLeft:10,borderBottomWidth:this.props.lastItem,
      style={{height:normalize(80),width:'95%',backgroundColor:'#fff',alignSelf:'center',borderWidth:1,borderColor:'#c0c0c874',flexDirection:'row',marginBottom:12.5,paddingHorizontal:15,borderRadius:10,paddingVertical:5,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 3,
      minHeight: 40,
    }}
      >
      <View  style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
      <Image  resizeMode={'contain'} source={data.path&&data.path!==''?{uri: data.path}:require('../../images/logo.jpeg')}
   // style={{width: dataLength && dataLength >=max_datalength?90:180, height: dataLength && dataLength>=max_datalength?90:180}}
   style={{width: 50, height: 50}}
        />
      </View>
  <View style={{flex:5,backgroundColor:'#fff',paddingLeft:15,}}>
      {data.category&&data.category!==''&&(
      <View style={{flex:1,backgroundColor:'#fff',paddingBottom:3,alignItems:'flex-start',justifyContent:'flex-end',paddingHorizontal:10,overflow:'hidden',borderBottomLeftRadius:data.details&&data.details!==''?0:6,borderBottomRightRadius:data.details&&data.details!==''?0:6,}}>
  
   <Text numberOfLines={1} ellipsizeMode={'tail'} 
    // style={{fontSize:dataLength && dataLength>=max_datalength?13:18,fontWeight:'bold',color:'#ffff'}}
    style={{fontSize:15,fontWeight:'700',color:componentTextColor}}
    >{data.category}</Text>
      </View>
      )}
       {data.details && data.details!==''&&(
      <View style={{flex:1,backgroundColor:'#fff',paddingTop:3,alignItems:'flex-start',justifyContent:'flex-start',paddingHorizontal:10,overflow:'hidden',}}>
    <Text numberOfLines={1} ellipsizeMode={'tail'}
  // style={{fontSize:dataLength && dataLength>=max_datalength?12:16,fontWeight:'800',color:'black'}}
  style={{fontSize:12,fontWeight:'800',color:'black'}}
     >{data.details}</Text>
      </View>
       )}
</View>

    </TouchableOpacity>
  
      
    );
  }
}

const mapStateToProps = state => ({
  authorization: state.authorization,
});

export default connect(mapStateToProps)(HomeComponent);
