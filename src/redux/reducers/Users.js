import { FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAIL, DELETE_USER_REQUEST, DELETE_USER_FAIL, DELETE_USER_SUCCESS } from "redux/constants/Users";

const initState = {
  loading: false,
  users: [],
  error: null,
}

const users = (state = initState, action) => {
  switch(action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case FETCH_USERS_FAIL:
    case DELETE_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_USER_REQUEST: 
      return {
        ...state,
        loading: true,
        error: null,
      }
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
        loading: false
      };
    default:
      return state;
  }

}

export default users;