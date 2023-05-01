import axios from "axios";

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 403) {
      console.log(error);
      console.log("Access denied. Redirecting to login page.");
      if (window.location.toString() != "http://localhost:8080/") {
        window.location.replace("/");
      }
      // Redirect the user to the login page
    } else {
      // Handle other errors
      console.log(error);
    }
    return Promise.reject(error);
  },
);

export default axios;
