import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";


const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  
  return (
    <Box className="header">
      <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>) : localStorage.getItem("username") ? (
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Avatar src="avatar.png" alt={localStorage.getItem("username")} />
            <p className="username-text">{localStorage.getItem("username")}</p>
            <Button variant="text" onClick={() => {
              localStorage.clear();
              window.location.reload();
              history.push("/");
            }}>LOGOUT</Button>
          </Stack>
        ): (
          <Stack direction="row" spacing={2}>
            <Button variant="text" onClick={() => history.push("/login")}>LOGIN</Button>
            <Button variant="contained"  onClick={() => history.push("/register")}>REGISTER</Button>
          </Stack>
        )}
    </Box>
  );
};

export default Header;
