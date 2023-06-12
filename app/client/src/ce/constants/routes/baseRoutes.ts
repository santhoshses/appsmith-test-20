const { match } = require("path-to-regexp");

export const BASE_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "";
// The below commented lines are used when dynamic routing is prefered.
// process.env.REACT_APP_ROUTE
//   ? process.env.REACT_APP_ROUTE
//   : "";
export const WORKSPACE_URL = BASE_URL + "/workspace";
export const PAGE_NOT_FOUND_URL = BASE_URL + "/404";
export const SERVER_ERROR_URL = BASE_URL + "/500";
export const APPLICATIONS_URL = BASE_URL + `/applications`;

export const TEMPLATES_PATH = BASE_URL + "/templates";
export const TEMPLATES_ID_PATH = BASE_URL + "/templates/:templateId";

export const USER_AUTH_URL = BASE_URL + "/user";
export const PROFILE = BASE_URL + "/profile";
export const GIT_PROFILE_ROUTE = `${PROFILE}/git`;
export const USERS_URL = BASE_URL + "/users";
export const SETUP = BASE_URL + "/setup/welcome";
export const FORGOT_PASSWORD_URL = `${USER_AUTH_URL}/forgotPassword`;
export const RESET_PASSWORD_URL = `${USER_AUTH_URL}/resetPassword`;
export const BASE_SIGNUP_URL = BASE_URL + `/signup`;
export const SIGN_UP_URL = `${USER_AUTH_URL}/signup`;
export const BASE_LOGIN_URL = BASE_URL + `/login`;
export const AUTH_LOGIN_URL = `${USER_AUTH_URL}/login`;
export const SIGNUP_SUCCESS_URL = BASE_URL + `/signup-success`;
export const WORKSPACE_INVITE_USERS_PAGE_URL = `${WORKSPACE_URL}/invite`;
export const WORKSPACE_SETTINGS_PAGE_URL = `${WORKSPACE_URL}/settings`;

export const matchApplicationPath = match(APPLICATIONS_URL);
export const matchTemplatesPath = match(TEMPLATES_PATH);
export const matchTemplatesIdPath = match(TEMPLATES_ID_PATH);
