import Link from "next/link";
import { Fragment, useContext, useEffect } from "react";
import AdminContext from "../../store/admin/adminContext";
import classes from "../../styles/style";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import TableContainer from "@mui/material/TableContainer";
import ListItemText from "@mui/material/ListItemText";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import List from "@mui/material/List";
import dynamic from "next/dynamic";

import { useSnackbar } from "notistack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/styles";
const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

function AdminUsers() {
  const adminContext = useContext(AdminContext);
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const {
    loading,
    fetchUsersRequest,
    fetchUsersSuccess,
    fetchUsersFail,
    users,
    deleteRequest,
    deleteSuccess,
    deleteFail,
    deleteReset,
    loadingDelete,
    successDelete,
  } = adminContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchUsersRequest();
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        fetchUsersSuccess(data.users);
      } catch (error) {
        fetchUsersFail(error);
      }
    };
    if (successDelete) {
      deleteReset();
    } else {
      fetchData();
    }
  }, [successDelete]);
  const deleteHandler = async userId => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      deleteRequest();
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      deleteSuccess();
      enqueueSnackbar(data.message, { variant: "success" });
    } catch (err) {
      deleteFail();
      enqueueSnackbar(err, { variant: "error" });
    }
  };
  return (
    <Fragment>
      <HeadTag title="users" />
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
              <ListItem>
                <Typography component="h1" variant="h1">
                  users
                </Typography>
                {loadingDelete && <CircularProgress />}
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <TableContainer sx={{ width: "100%" }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {isDesktop ? (
                            <Fragment>
                              <TableCell>ID</TableCell>
                              <TableCell>NAME</TableCell>
                              <TableCell>EMAIL</TableCell>
                              <TableCell>ISADMIN</TableCell>
                              <TableCell>ACTIONS</TableCell>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <TableCell>EMAIL</TableCell>
                              <TableCell>ISADMIN</TableCell>
                              <TableCell>ACTIONS</TableCell>
                            </Fragment>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users &&
                          users.map(user => (
                            <TableRow key={user._id}>
                              {isDesktop ? (
                                <Fragment>
                                  <TableCell>
                                    {user._id.substring(20, 24)}
                                  </TableCell>
                                  <TableCell>{user.name}</TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell>
                                    {user.isAdmin ? "YES" : "NO"}
                                  </TableCell>
                                  <TableCell>
                                    <Link
                                      href={`/admin/user/${user._id}`}
                                      passHref
                                    >
                                      <Button
                                        size="small"
                                        variant="contained"
                                        sx={{ marginBottom: 1, marginLeft: 1 }}
                                      >
                                        Edit
                                      </Button>
                                    </Link>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => deleteHandler(user._id)}
                                      sx={{ marginBottom: 1, marginLeft: 1 }}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </Fragment>
                              ) : (
                                <Fragment>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell>
                                    {user.isAdmin ? "YES" : "NO"}
                                  </TableCell>
                                  <TableCell sx={{ alignItems: "center" }}>
                                    <Link
                                      href={`/admin/user/${user._id}`}
                                      passHref
                                    >
                                      <Button
                                        size="small"
                                        variant="contained"
                                        sx={{ marginBottom: 1 }}
                                      >
                                        Edit
                                      </Button>
                                    </Link>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => deleteHandler(user._id)}
                                      sx={{ marginBottom: 1 }}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </Fragment>
                              )}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });
