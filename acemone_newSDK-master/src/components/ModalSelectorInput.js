import React, { Component } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { Input, Icon, normalize } from "react-native-elements";

export default class ModalSelectorInput extends Component {
  _isMounted = null;

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      dialogOpen: false,
      search: null,
    };
  }

  render() {
    const {
      editable,
      placeholder,
      textValue,
      onItemSelect,
      dropDownWidth,
      containerStyle,
      disabled,
      label,
      data,
      value,
      defaultValue,
      activity,
    } = this.props;
    let { dialogOpen, search, list } = this.state;
    let activity_indicator = activity ? activity : false;
    return (
      <View
        style={[
          containerStyle ? containerStyle : {},
          { width: "100%", alignItems: "center" },
        ]}
      >
        <TouchableOpacity
          onPress={() => this.setState({ dialogOpen: !dialogOpen })}
          style={{
            width: dropDownWidth ? dropDownWidth : "100%",
          }}
          disabled={disabled}
        >
          <View
            style={{
              flexDirection: "row",
              // paddingVertical: '1%',
              width: "110%",
              marginTop: "1%",
              height: "92%",
              //borderBottomWidth: 1,
              justifyContent: "flex-start",
              paddingLeft: -1,
              borderBottomColor: "#A3A4A4",
            }}
            pointerEvents="none"
          >
            <View style={{ width: "80%", justifyContent: "center" }}>
              <TextInput
                style={{
                  fontSize: 18,
                  fontWeight: "400",
                  paddingLeft: 15,
                  justifyContent: "center",
                  color: "black",
                }}
                placeholderTextColor="grey"
                placeholder={placeholder ? placeholder : null}
                value={value}
                editable={false}
              />
            </View>
            <View
              style={{
                width: "10%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {editable && (
                <Icon
                  name={dialogOpen ? "chevron-small-up" : "chevron-small-down"}
                  type="entypo"
                  size={24}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
        {/* CODE FOR MODAL */}
        <Modal
          isVisible={dialogOpen}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropOpacity={0.3}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
          onBackdropPress={() => {
            this.setState({ dialogOpen: false });
          }}
          onBackButtonPress={() => {
            this.setState({ dialogOpen: false });
          }}
        >
          <View
            style={{
              // display: "flex",
              backgroundColor: "#fff",
              minHeight: normalize(350),
              width: "90%",
              borderRadius: 6,
              padding: 5,
            }}
          >
            {label && (
              <View style={{ flex: 2, flexDirection: "row" }}>
                <View
                  style={{
                    flex: 9,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "500" }}>
                    {label ? label : ""}
                  </Text>
                </View>
              </View>
            )}
            <View
              style={{
                flex: 1.4,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1500,
              }}
            >
              <Input
                
                editable
                placeholder={"Search"}
                placeholderTextColor={"grey"}
                value={search}
                onChangeText={(text) => {
                  if (text === "") {
                    text = null;
                  }
                  this.setState({
                    search: text,
                  });
                }}
                inputContainerStyle={{
                  paddingLeft: 0,
                  borderWidth: 1,
                  borderRadius: 6,
                  borderColor: '#EDEDEF',
                  backgroundColor: '#EDEDEF',
                 
                }}
                inputStyle={{
                  marginLeft: 6,
                  fontSize: 17,
                  paddingLeft: 0,
                  color: '#0C0C0C',
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  borderRightWidth:0,
                  borderColor:'#fafafa',
                  
                }}
                containerStyle={{
                  width: '96%',
                  paddingHorizontal: 0,
                }}
                leftIconContainerStyle={{alignItems:'center'}}
                leftIcon={
                  <View  style={{
                    height: 30,
                    width: 30,
                    justifyContent: "center",
                    alignItems:'center',
                    marginLeft:5
                  }}>
                  <Icon
                  name="search"
                  type={'Octicons'}
                  size={21}
                  color="#8a8a8f"
                />
                </View>
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => this.setState({ dialogOpen: false })}
                    style={{
                      height: 30,
                      width: 35,
                      justifyContent: "center",
                      alignItems:'center',
                      marginLeft:5
                    }}
                  >
                   <Icon
                      name={ 'checkcircle' }
                      type={'antdesign'}
                      size={21}
                      color="#555555"
                      //color={"#004482ab"}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            <View style={{ flex: 5, paddingTop: 1 }}>
              {activity_indicator == true ? (
                <ActivityIndicator size={"small"} color={"#c0c0c8"} />
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps={"always"}
                  data={data.filter((value) => {
                    // let searchTerm = `${country.name} ${country.code} ${country.name1} ${
                    //   country.name2
                    // }`;
                    let searchTerm = value.name;

                    if (search && search.length >= 1) {
                      if (
                        searchTerm
                          .toLocaleLowerCase()
                          .includes(search.toLocaleLowerCase())
                      ) {
                        return value;
                      }
                    } else {
                      return value;
                    }
                  })}
                  style={{ flex: 1, width: "100%" }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{ width: "100%", display: "flex" }}
                      onPress={() => {
                        this.setState({ dialogOpen: false });
                        onItemSelect(item);
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "center",
                          minWidth: "100%",
                          borderBottomColor: "#c0c0c867",
                          borderBottomWidth: 0.5,
                        }}
                      >
                        <Text
                          style={{
                            paddingVertical: 5,
                            marginVertical: 10,
                            textAlign: "left",
                            fontSize: 16,
                            letterSpacing: 0.3,
                            color: "#222",
                            paddingLeft: 10,
                          }}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
