import axios from "axios";
import { AsyncStorage } from "react-native";
import store from "../store";
//import { getLanguage } from '../i18';
//import { webSocket } from '../utils/webSocket';

export const apiRoot = "http://portal.janasevanakendra.com/";

export const login = creds => {
  //let creds={username:'test',password:'test'}
  let loginType = "";
  console.log("login CREDS : ", creds);

  const formData = new FormData();
  if (creds.username && creds.password) {
    loginType="login-normal"
    formData.append("agent_email", creds.username);
    formData.append("password", creds.password);
   
  }
 

  return axios
    .post(apiRoot + "api/agent-app-login", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(result => {
      console.log(result, "== loginresult ==");
      // AsyncStorage.setItem('loginState', result.data.refresh_token);
      // if (result && result.data && result.data.uuid) {
      //   webSocket(apiRoot, result.data.uuid);
      // }
      // store.dispatch({ type: 'LOGIN_LOADING', payload: false });
      store.dispatch({ type: "USER_DETAILS", payload: result.data });
      return result;
    });
};

export const register_user = payload => {
  const formData = new FormData();

  formData.append("username", payload.userName);
  formData.append("mobile_number", payload.mobileNumber);
  formData.append("email_id", payload.emailId);
  formData.append("password", payload.password);
  formData.append("mpin", payload.mPin);
  formData.append("request_name", "registration");
  formData.append("bank_fname", "Santhosh");
  formData.append("bank_lname", "MG");
  formData.append("agent_email", "fotomaxkhd3@gmail.com");
  return axios
    .post(apiRoot + "api/registration", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(result => {
      console.log(result, "== register user ==");
      return result;
    });
};

export const getServiceList = () => {
  let response = axios.get(apiRoot + "api/service");

  console.log("list Details", response);
  return response;
};

export const getSubServicesList = async id_value => {
  let response = axios.get(apiRoot + "api/subcategory/" + id_value);

  console.log("list Details", response);
  return response;
};

export const getMultiLevelList = async id_value => {
  let response = axios.get(apiRoot + "api/multiple/" + id_value);

  console.log("list Details", response);
  return response;
};

export const getSearchResultList = () => {
  let response = axios.get(apiRoot + "api/search");

  console.log("search result list Details", response);
  return response;
};
