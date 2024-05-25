import {
    GET_TOKEN,
    API_START,
    API_END,
    SET_TOKEN
  } from "../../actions/types";
  
  export default (state = {}, action: any) => {
    switch (action.type) {
      case SET_TOKEN: {
          return { data: action.payload };
      }
      case API_START:
        if (action.payload === GET_TOKEN) {
          return {
            ...state,
            isLoadingData: true
          };
        }
        break;
      case API_END:
        if (action.payload === GET_TOKEN) {
          return {
            ...state,
            isLoadingData: false
          };
        }
        break;
      default:
        return state;
    }
  }