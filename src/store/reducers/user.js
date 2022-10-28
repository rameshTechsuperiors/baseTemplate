import { isAuth } from "../../helpers/auth";

const INITIAL_STATE = {
  auth: {},
  isOtp: false,
  errors: {},
  userData: {},
  currentStudy: {},
  language: {},
  enable: {},
  userLoginData: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "PROFILE_SUCCESS":
      return { ...state, userData: action.payload, isOtp: false };
    case `USER_LOGIN`:
      console.log("action.payload", action.payload);
      return { ...state, userData: action.payload };
    default:
      return state;
  }
};
