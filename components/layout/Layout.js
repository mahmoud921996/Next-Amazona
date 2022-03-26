import { Fragment } from "react";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";

import classes from "../../styles/style";
const Navbar = dynamic(() => import("./Navbar"));
function Layout(props) {
  return (
    <Fragment>
      <Navbar />
      <Toolbar />
      <Container component="main" sx={classes.main}>
        {props.children}
      </Container>
      <Box component="footer" sx={classes.footer}>
        <Typography>All Right Reserved</Typography>
      </Box>
    </Fragment>
  );
}
export default Layout;
