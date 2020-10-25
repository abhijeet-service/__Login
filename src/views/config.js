let BASE_URL = "https://stagingapi.pichainlabs.com";
let FRONTEND_URL = "http://localhost:3000";
let API_KEY = localStorage.getItem("api_key");
let VERSION = "v1";
// let PROXY = "http://52.66.51.84:8000"
let PROXY = "http://localhost:8000";

if (process.env.REACT_APP_ENV === "development") {
  BASE_URL = "https://stagingapi.pichainlabs.com";
  FRONTEND_URL = "https://demo2.pichainlabs.com";
  API_KEY = localStorage.getItem("api_key");
  VERSION = "v1";
  PROXY = "https://recorder.pichainlabs.com";
  //PROXY = "http://localhost:8011";
}

if (process.env.REACT_APP_ENV === "staging") {
  BASE_URL = "https://preprodapi.pichainlabs.com";
  FRONTEND_URL = "https://vkycpreprod.pichainlabs.com";
  API_KEY = localStorage.getItem("api_key");
  VERSION = "v1";
  PROXY = "wss://meet.pichainlabs.com";
}

if (process.env.REACT_APP_ENV === "production") {
  BASE_URL = "https://api.pichainlabs.com";
  FRONTEND_URL = "https://kycdashboard.pichainlabs.com";
  API_KEY = localStorage.getItem("api_key");
  VERSION = "v1";
  PROXY = "https://vcmeet.pichainlabs.com";
}

export { BASE_URL, FRONTEND_URL, API_KEY, VERSION, PROXY };
