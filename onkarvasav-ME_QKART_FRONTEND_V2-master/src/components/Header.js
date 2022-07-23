import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { useHistory, Link } from "react-router-dom";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
    return (
      
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>{(localStorage.getItem("username"))?<>{children}<Stack direction="row" spacing={2}>
<img src="avatar.png" alt={localStorage.getItem("username")}></img><p>{localStorage.getItem("username")}</p>
<Button className="button" variant="text" onClick = {()=>{
          localStorage.clear()
          history.push("/")
          window.location.reload()}} >
         LOGOUT
        </Button></Stack></>:<>
        {hasHiddenAuthButtons?
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=>history.push("/")}
        >
          Back to explore
        </Button>
        :<>{children}<Stack spacing={2} direction = "row"><Button className="button" variant="text" onClick={()=>history.push("/login")} >
        LOGIN
         </Button>
         <Button className="button" variant="contained" onClick = {()=>history.push("/register")} >
         Register
        </Button></Stack></>}</>}
      </Box>
      );
};

export default Header;
