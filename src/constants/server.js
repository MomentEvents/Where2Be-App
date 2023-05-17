// PUT YOUR LOCALHOST IP ADDRESS HERE WHERE THE API CONTAINER IS RUNNING
const localhost = "http://100.80.243.28:8080";
const production = "https://api.momentevents.app";

const server = __DEV__ ? localhost : production
const version = "/api_ver_1.0.0";

export const momentAPIVersionless = localhost;
export const momentAPI = momentAPIVersionless + version;