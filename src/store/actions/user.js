import { get } from "lodash";
import { toast } from "react-toastify";
import API from "../../helpers/api";
import * as auth from "../../helpers/auth";
import { handleErrorMessage } from "../../utils/commonFunctions";
import { getLanguageDataDetails } from "../../helpers/auth";
import { decodeData } from "../../helpers/auth";
import { login as loginAuth } from "../../helpers/auth";
function errorRequest(err, dispatch) {
  let data = get(err, "response.data", null);
  data = data || get(err, "response");
  data = data || err;
  dispatch({
    type: "REQUEST_FAIL",
    payload: data,
  });
}

export function Userlogin(payload) {
  const payloadData = decodeData(payload.payload);
  const checkData = {
    personal_email: "ramesh@yopmail.com",
    password: "Welcome@123",
  };

  return (dispatch) => {
    if (payloadData && payloadData.personal_email && payloadData.password) {
      loginAuth(payloadData);
      setTimeout(() => {
        dispatch({ type: `USER_LOGIN`, payload: payloadData });
      }, 100);
    }
  };
}

export function Participantlogin(payload) {
  return (dispatch) => {
    const type = "AUTH";
    dispatch({ type: `${type}_REQUEST` });
    // dispatch(requestStart());

    try {
      API.apiPost("participantLogin", payload)
        .then(({ data }) => {
          if (data && data.token && data.success) {
            auth.login(data.token);
            dispatch({ type: `${type}_SUCCESS`, payload: data });
            setTimeout(() => {
              dispatch(getProfile());
            }, 100);
          }
        })
        .catch((err) => {
          errorRequest(err, dispatch);
          handleErrorMessage(err);
        });
    } catch (err) {
      errorRequest(err, dispatch);
    }
  };
}

export function login(payload) {
  return (dispatch) => {
    const type = "AUTH";
    dispatch({ type: `${type}_REQUEST` });
    // dispatch(requestStart());

    try {
      API.apiPost("login", payload)
        .then(({ data }) => {
          if (data && data.token && data.status) {
            auth.login(data.token);
            dispatch({ type: `${type}_SUCCESS`, payload: data });
            setTimeout(() => {
              dispatch(getProfile());
            }, 500);
          }
        })
        .catch((err) => {
          errorRequest(err, dispatch);
          handleErrorMessage(err);
        });
    } catch (err) {
      errorRequest(err, dispatch);
    }
  };
}

export function getProfile() {
  return (dispatch) => {
    const type = "PROFILE";
    try {
      API.apiGet("profile")
        .then((response) => {
          if (
            response.data &&
            response.data.data &&
            response.data.status === true
          ) {
            let payload = auth.decodeData(response.data.data);
            dispatch({ type: `${type}_SUCCESS`, payload });
          }
        })
        .catch((err) => {
          errorRequest(err, dispatch);
        });
    } catch (err) {
      errorRequest(err, dispatch);
    }
  };
}

export function logout() {
  return (dispatch) => {
    try {
      API.apiPost("logout", {});
    } catch (err) {
      errorRequest(err, dispatch);
    }
  };
}
