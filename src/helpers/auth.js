import decode from "jwt-decode";
import { Base64 } from "js-base64";
import { setAuthorization } from "./api/index";

export function getToken() {
  if (process.browser) {
    return localStorage.getItem("personal_email");
  }
  return "";
}

export const encodeData = (payload) => {
  try {
    // let dataString = Base64.btoa(JSON.stringify(payload));
    let dataString = Base64.btoa(encodeURI(JSON.stringify(payload)));
    return dataString;
  } catch (error) {
    return null;
  }
};

export const decodeData = (token) => {
  try {
    let payload = JSON.parse(decodeURI(Base64.atob(token)));
    return payload;
  } catch (error) {
    return null;
  }
};

export const encodeDataLib = (payload) => {
  try {
    let dataString = Base64.encodeURL(JSON.stringify(payload));
    return dataString;
  } catch (error) {
    return null;
  }
};

export const decodeDataLib = (token) => {
  try {
    let payload = JSON.parse(Base64.decode(token));
    return payload;
  } catch (error) {
    return null;
  }
};

export function decryptedToken(token) {
  try {
    return decode(token);
  } catch (err) {
    return false;
  }
}

export function makeWebId(length) {
  const result = [];
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

export function currentUser() {
  return localStorage.getItem("personal_email");
}

export function isAuth() {
  try {
    const tokenChecked = localStorage.getItem("personal_email");
    if (tokenChecked) {
      return decryptedToken(tokenChecked);
    }
    return false;
  } catch (err) {
    return false;
  }
}

export function login(data) {
  localStorage.setItem("personal_email", data.personal_email);
  localStorage.setItem("password", data.password);
  setAuthorization();
  return true;
}

export function setRemember(user = {}) {
  localStorage.setItem("userRemember", JSON.stringify(user || isAuth()));
  return true;
}

export function removeRemember() {
  localStorage.removeItem("userRemember");
  return true;
}

export function logout() {
  localStorage.removeItem("groupMemo");
  localStorage.removeItem("personal_email");
  localStorage.removeItem("password");
  localStorage.removeItem("currentStudy");
  localStorage.removeItem("language");
  setAuthorization();
  setTimeout(() => {
    if (process.browser) window.location.href = `${window.location.origin}/`;
  }, 500);
  return true;
}
