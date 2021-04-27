const initialState = {
    drawerPage:'home',
  
  };
  
  

  
  
  
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'DRAWER_PAGE':
        return {
          ...state,
          drawerPage:action.payload
        };
      
      default:
        return state;
    }
  };
  
  export default reducer;
  