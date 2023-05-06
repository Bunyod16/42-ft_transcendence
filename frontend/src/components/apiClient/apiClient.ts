import axios from "axios";
import Error from "next/error";

// Add a response interceptor
// axios.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     // if (error.response) {
//     //   console.log(error.response);
//     //   console.log("Access denied. Redirecting to login page.");
//     //   if (window.location.toString() != "http://localhost:8080/") {
//     //     window.location.replace("/");
//     //   }
//     //   // Redirect the user to the login page
//     // } else {
//     //   // Handle other errors
//     //   console.log(error);
//     // }
//     if (error.code === "ERR_NETWORK") return;
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.log("ERROR RESPONSE");
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
//     } else if (error.request) {
//       // The request was made but no response was received
//       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//       // http.ClientRequest in node.js
//       console.log("ERROR RESQUEST");
//       console.log(error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.log("ERROR", error.message);
//     }
//     console.log(error);
//     return Promise.reject(error);
//   },
// );

axios.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      alert("You are not authorized");
    }
    return response;
  },
  (error) => {
    if (error.response) {
      console.log(error.response);
      console.log("Access denied. Redirecting to login page.");
      // if (window.location.toString() != "http://localhost:8080/") {
      //   window.location.replace("/");
      // }
    }
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
  },
);

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.withCredentials = true;

export default axios;
