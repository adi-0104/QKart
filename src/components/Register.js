import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { green } from '@mui/material/colors';
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, updateFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setLoader] = useState(false);
  // const [isSuccess, setSuccess] = useState(false);
  const handleFormData = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    updateFormData({...formData,[name] : val});
  }

  const history = useHistory();


  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    let form = {
      "username": formData.username,
      "password": formData.password
    }
    setLoader(true);
    if(validateInput(formData)){
      try {
        await axios.post(`${config.endpoint}/auth/register`, form);
        setLoader(false);
        updateFormData({
          username: "",
          password: "",
          confirmPassword: ""
        })
        enqueueSnackbar("Registered successfully", { variant: "success" });
        history.push("/login")
        
      }
      catch (err) {
        if (err.response.status === 400) {
          setLoader(false);
          enqueueSnackbar(err.response.data.message, { variant: "error" })
        }
        else {
          setLoader(false);
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", { variant: "error" })
        } 
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    
    // Check that username field is not an empty value - "Username is a required field"
    if (data.username === "") {
      setLoader(false);
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    //  Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
    else if (data.username.length < 6) {
      setLoader(false);
      enqueueSnackbar("Username must be at least 6 characters", { variant: "warning" });
      return false;
    }
    // Check that password field is not an empty value - "Password is a required field"
    else if (data.password === "") {
      setLoader(false);
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    // Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
    else if (data.password.length < 6) {
      setLoader(false);
      enqueueSnackbar("Password must be at least 6 characters", { variant: "warning" });
      return false;
    }
    // Check that confirmPassword field has the same value as password field - Passwords do not match
    else if (data.password !== data.confirmPassword) {
      setLoader(false);
      enqueueSnackbar("Passwords do not match", { variant: "warning" })
      return false;
    }
    else return true;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            onChange={handleFormData}
            value= {formData.username}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            onChange={handleFormData}
            value={formData.password}
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleFormData}
            value={formData.confirmPassword}
            type="password"
            fullWidth
          />
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
          ): (
            <Button className="button" variant="contained"  onClick={() => register(formData)}>
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
             <Link className="link" to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
