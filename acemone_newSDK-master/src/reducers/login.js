const initialState = {
  userDetails: {},
  loginHeaderHiding: false,
  bearerToken:'',
  agentEmail:'',
  account_balance:0,
  microatm_type:''
};

export const apiRoot = "";

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_DETAILS":
      return {
        ...state,
        userDetails: action.payload
        // authorization: {
        //   headers: {
        //     Authorization: `${action.payload.token_type} ${action.payload.access_token}`,
        //     'Content-Type': 'application/json',
        //   },
        // },
      };
    case "LOGIN_HEADER_HIDING":
      return { ...state, loginHeaderHiding: action.payload };
      case "SET_BEARER_TOKEN":
        return { ...state, bearerToken: action.payload };
      case "HOME_PAGE_ACC_BAL":
          return { ...state, account_balance: action.payload };
      case "SET_AGENT_EMAIL":
          return { ...state, agentEmail: action.payload };
     case "SET_MICRO_ATM_TYPE":
          return { ...state, microatm_type: action.payload };    
    default:
      return state;
  }
};

export default reducer;
