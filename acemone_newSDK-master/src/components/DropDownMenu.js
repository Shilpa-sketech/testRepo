import React, { Component } from 'react';
import { View, Text } from 'react-native';
import DropDownMenu from './ModalDropDown';
import { Icon } from 'react-native-elements';


export default class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      selectedValue: '',
    };
  }

 

  render() {
    const {
      list,
      bottomLineColor,
      editable,
      initialValue,
      onSelectAnOption,
      textColor,
      label,
      labelColor,
      containerStyle,
      dropDownWidth,
      dropDownLayoutWidth,
      marginBottom,
      showLabel,
      paddingLeft,
      LabelpaddingBottom,
      dropContainerHeight,
      fontSize,newHeight,
      optionalColor,
      labelStyle
    } = this.props;
    let translatedList = list;
    let { dialogOpen, selectedValue } = this.state;
    return (
      <View
        style={[
          { marginBottom: marginBottom ? marginBottom : 0, paddingHorizontal: 1 },
          containerStyle ? containerStyle : {},
        ]}
      >
        {showLabel && (
          <Text
            style={[{
              color: labelColor ? labelColor : 'black',
              fontSize: 14,fontWeight:'bold',
              paddingLeft: paddingLeft ? paddingLeft : 0,
             // PaddingBottom: LabelpaddingBottom ? LabelpaddingBottom : '',
             marginBottom:10
            },labelStyle?labelStyle:{}]}
          >
            {label ? label : ''}
          </Text>
        )}
        <DropDownMenu
          ref="dropdownref"
          style={{
            display: 'flex',
            //width: dropDownWidth ? dropDownWidth : '100%',
            width:'100%',
            //height: dropContainerHeight ? dropContainerHeight : 50,
            height:50,
            borderRadius:3,
            alignItems: 'flex-start',
            justifyContent: 'center',
            // minHeight: 40,
            //paddingLeft: 10,
            //borderBottomColor: bottomLineColor ? bottomLineColor : '#dddcdc',
            borderWidth: 1,
            borderColor:'#c0c0c8'
          }}
          disabled={!editable}
          animated
          defaultValue={initialValue ? initialValue : 'Choose an option'}
          options={translatedList}
          onSelect={index => {
            onSelectAnOption(index);
            this.setState({ selectedValue: translatedList[index] });
          }}
          
          textStyle={{
            fontSize:  16,
            fontWeight: '400',
            color: textColor ? textColor : '#000',
          }}
          
          showsVerticalScrollIndicator={false}
          dropdownStyle={{
            width: dropDownLayoutWidth ? dropDownLayoutWidth : '90%',
            // height: 42 * (list ? list.length : 1),
            //backgroundColor: 'red',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6,
          }}
          dropdownTextStyle={{ fontSize: 16 }}
          onDropdownWillShow={() => this.setState({ dialogOpen: true })}
          onDropdownWillHide={() => this.setState({ dialogOpen: false })}
        >
          <View
            style={{
              display: 'flex',
              width: dropDownWidth ? dropDownWidth : '100%',
              alignItems: 'flex-start',
              justifyContent: 'center',
              minHeight: 40,
              //paddingLeft:10,
              borderBottomColor: bottomLineColor ? bottomLineColor : '#595959',
              //borderBottomWidth: 1,
              paddingHorizontal:10
            }}
            disabled={!editable}
            animated
            defaultValue={initialValue ? initialValue : 'Choose an option'}
            options={translatedList}
            onSelect={index => {
              onSelectAnOption(index);
              this.setState({ selectedValue: translatedList[index] });
            }}
            textStyle={{
              fontSize: 16,
              fontWeight: '400',
            //  color: textColor ? textColor : '#4D4B4B',
            color:'grey'
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={{
              width: dropDownLayoutWidth ? dropDownLayoutWidth : '100%',
              height: newHeight?newHeight:42 * (list ? list.length : 1),
              backgroundColor: 'red',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 6,
            }}
            dropdownTextStyle={{ fontSize: 16 }}
            onDropdownWillShow={() => this.setState({ dialogOpen: true })}
            onDropdownWillHide={() => this.setState({ dialogOpen: false })}
          >
            <View
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft:5
              }}
            >
              <View style={{ flex: 4 }}>
                <Text style={{ fontSize:fontSize ? fontSize : 16 ,color:selectedValue?'black':optionalColor?optionalColor:'grey'}}>
                  {
                    selectedValue
                      ? selectedValue
                      : initialValue
                      ? initialValue
                      : 'Choose an option'
                  }
                </Text>
              </View>
              {editable && (
                <Icon
                  name={dialogOpen ? 'chevron-small-up' : 'chevron-small-down'}
                  type="entypo"
                  size={24}
                />
              )}
            </View>
          </View>
        </DropDownMenu>
      </View>
    );
  }
}
