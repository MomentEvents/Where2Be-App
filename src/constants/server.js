// PUT YOUR LOCALHOST IP ADDRESS HERE WHERE THE API CONTAINER IS RUNNING
const localhost = "http://192.168.1.67:8080";
const production = "https://api.momentevents.app";

const server = __DEV__ ? localhost : production
const version = "/api_ver_1.0.0";

export const momentAPIVersionless = production;
export const momentAPI = momentAPIVersionless + version;