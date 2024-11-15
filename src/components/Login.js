import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { green } from '@mui/material/colors';
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [ isLoading, setLoader] = useState(false)
  const [ loginData, setLoginData ] = useState({
    username: "",
    password: ""
  })

  const HandleLoginData = (e) => {
    setLoginData({...loginData,[e.target.name]: e.target.value}) 
  }

  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    //validate user input
    if (validateInput(formData)) {
      try {
        setLoader(true);
        const res = await axios.post(`${config.endpoint}/auth/login`, formData);
        persistLogin(res.data.token,res.data.username, res.data.balance)
        enqueueSnackbar("Logged In Successfully ", { variant: "success" });
        setLoader(false);
        history.push("/");
      }
      catch (err) {
        //check for 400 error or not and return r3espective messages
        if (err.response.status === 400) {
          setLoader(false);
          enqueueSnackbar(err.response.data.message,{variant: "error"})
        }
        else {
          setLoader(false);
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant: "error"})
        }
      }
      
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if (data.username === "") {
      setLoader(false);
      enqueueSnackbar("Username is a required field", {variant: "warning"})
      return false
    }
    else if (data.password === "") {
      setLoader(false);
      enqueueSnackbar("Password is a required field", {variant: "warning"})
      return false
    }
    else {
      return true
    }

  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("username", username);
    window.localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField name="username" value={loginData.username} variant="outlined" label="Username" onChange={HandleLoginData} />
          <TextField name="password" value={loginData.password} variant="outlined" label="Password" type="password" onChange={HandleLoginData} />
          {isLoading ? (
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
              >
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500]
                  }}
                />
              </Box>
          ) : (<Button  variant="contained" onClick={() => login(loginData)}>LOGIN TO QKART</Button>) }
          <p className="secondary-action"> Don't Have an Account?{" "}<Link to="/register" className="link">Register Now</Link></p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
