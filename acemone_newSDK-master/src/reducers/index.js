import { combineReducers } from "redux";
import login from "./login";
import theme from "./theme";
import drawer from './drawer'

export default combineReducers({
  login,
  theme,
  drawer
});
