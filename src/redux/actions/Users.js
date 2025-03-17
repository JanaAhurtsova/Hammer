import { FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAIL, DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAIL } from "redux/constants/Users";

export const fetchUsersRequest = () => ({
  type: FETCH_USERS_REQUEST,
});

export const fetchUsersSuccess = (users) => ({
  type: FETCH_USERS_SUCCESS,
  payload: users,
});

export const fetchUsersFail = (error) => ({
  type: FETCH_USERS_FAIL,
  payload: error,
});

export const deleteUserRequest = (id) => ({
  type: DELETE_USER_REQUEST,
  payload: id
});

export const deleteUserSuccess = (id) => ({
  type: DELETE_USER_SUCCESS,
  payload: id
});

export const deleteUserFail = (error) => ({
  type: DELETE_USER_FAIL,
  payload: error
})