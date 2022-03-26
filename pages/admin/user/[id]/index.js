import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import AdminContext from "../../../../store/admin/adminContext";
import classes from "../../../../styles/style";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

const HeadTag = dynamic(() => import("../../../../components/layout/HeadTag"));

const Form = dynamic(() => import("../../../../components/Form"));

function EditUser(props) {
  const userId = props.params.id;
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const adminContext = useContext(AdminContext);
  const {
    loading,
    error,
    fetchUserStart,
    fetchUserSuccess,
    fetchUserFail,
    loadingUpdate,
    errorUpdate,
    updateRequest,
    updateSuccess,
    updateFail,
  } = adminContext;

  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchUserStart();
        const response = await fetch(`/api/admin/users/${userId}`);
        const { user } = await response.json();
        fetchUserSuccess();
        setName(user.name);
        setIsAdmin(user.isAdmin);
      } catch (err) {
        fetchUserFail(err);
      }
    };
    fetchData();
  }, []);
  const submitHandler = async e => {
    e.preventDefault();
    closeSnackbar();

    try {
      updateRequest();

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ name, isAdmin }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      updateSuccess();
      enqueueSnackbar(data.message, { variant: "success" });

      router.push("/admin/users");
    } catch (error) {
      updateFail();
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  return (
    <Fragment>
      <HeadTag title={`Edit user ${userId}`} />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <Link href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/admin/users" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </Link>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <Grid container>
                <Grid item md={6}></Grid>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Edit User {userId}
                  </Typography>
                </ListItem>
              </Grid>

              <ListItem>
                <Box sx={{ width: "100%" }}>
                  <Form onSubmit={submitHandler}>
                    <List>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="name"
                          name="name"
                          label="Name"
                          inputProps={{ type: "text" }}
                          value={name}
                          onChange={e => setName(e.target.value)}
                        ></TextField>
                      </ListItem>

                      <ListItem>
                        <FormControlLabel
                          label="Is Admin"
                          control={
                            <Checkbox
                              onClick={e => setIsAdmin(e.target.checked)}
                              checked={isAdmin}
                              name="isAdmin"
                            />
                          }
                        ></FormControlLabel>
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
                        {loadingUpdate && <CircularProgress />}
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

export async function getServerSideProps({ params }) {
  return {
    props: {
      params,
    },
  };
}
export default dynamic(() => Promise.resolve(EditUser), { ssr: false });
