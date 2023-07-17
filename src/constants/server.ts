import backendConfig from "../../backendconfig.json"

const server = backendConfig[backendConfig["env"]].apiUrl
const version = backendConfig[backendConfig["env"]].apiVersion

export const momentAPIVersionless = server;
export const momentAPI = momentAPIVersionless + version;