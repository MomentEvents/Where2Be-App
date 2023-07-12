// PUT YOUR LOCALHOST IP ADDRESS HERE WHERE THE API CONTAINER IS RUNNING
const localhost = "http://10.73.70.101:8080";
const production = "https://api.momentevents.app";

const server = __DEV__ ? localhost : production
const version = "/v1.0.1";

export const momentAPIVersionless = localhost;
export const momentAPI = momentAPIVersionless + version;