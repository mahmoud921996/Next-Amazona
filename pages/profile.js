import { signOut, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import classes from "../styles/style";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import dynamic from "next/dynamic";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
const InpField = dynamic(() => import("../components/InpField"));
const Form = dynamic(() => import("../components/Form"));
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

function Profile({ session }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleChange = e => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  useEffect(() => {
    setUserCredentials({ ...userCredentials, email: session.user.email });
  }, [session, router]);

  const submitHandler = async e => {
    e.preventDefault();
    closeSnackbar();

    if (userCredentials.newPassword !== userCredentials.confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: "error" });
      return;
    }
    const oldPassword = userCredentials.oldPassword,
      newPassword = userCredentials.newPassword;
    try {
      const response = await fetch("/api/auth/user/profile", {
        method: "PATCH",
        body: JSON.stringify({ oldPassword, newPassword }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      enqueueSnackbar(data.message, { variant: "success" });
    } catch (error) {
      console.log(error);
    }

    try {
      signOut();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Fragment>
      <HeadTag title="profile" />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <Link href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/order-history" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Order History"></ListItemText>
                </ListItem>
              </Link>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Profile
                </Typography>
              </ListItem>
              <ListItem>
                <Box sx={{ width: "100%", margin: "0 auto" }}>
                  <Form onSubmit={submitHandler}>
                    <List>
                      <ListItem>
                        <InpField
                          name="email"
                          id="email"
                          label="E-mail"
                          variant="outlined"
                          fullWidth
                          inputProps={{ type: "email" }}
                          onChange={handleChange}
                          value={userCredentials.email}
                        />
                      </ListItem>
                      <ListItem>
                        <InpField
                          name="oldPassword"
                          id="oldPassword"
                          label="old Password"
                          variant="outlined"
                          fullWidth
                          inputProps={{ type: "password" }}
                          onChange={handleChange}
                          value={userCredentials.oldPassword}
                        />
                      </ListItem>
                      <ListItem>
                        <InpField
                          name="newPassword"
                          id="newPassword"
                          label="new Password"
                          variant="outlined"
                          fullWidth
                          value={userCredentials.newPassword}
                          inputProps={{ type: "password" }}
                          onChange={handleChange}
                        />
                      </ListItem>
                      <ListItem>
                        <InpField
                          name="confirmPassword"
                          id="confirmPassword"
                          label="confirm Password"
                          variant="outlined"
                          fullWidth
                          inputProps={{ type: "password" }}
                          onChange={handleChange}
                          value={userCredentials.confirmPassword}
                        />
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          color="primary"
                        >
                          Update
                        </Button>
                      </ListItem>
                    </List>
                  </Form>
                </Box>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
export default dynamic(() => Promise.resolve(Profile), { ssr: false });
