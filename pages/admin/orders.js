import Link from "next/link";
import { Fragment, useContext, useEffect } from "react";
import AdminContext from "../../store/admin/adminContext";
import classes from "../../styles/style";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemText from "@mui/material/ListItemText";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import ListItem from "@mui/material/ListItem";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";
import dynamic from "next/dynamic";

import { useTheme } from "@mui/styles";
const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

function AdminOrders() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const adminContext = useContext(AdminContext);
  const {
    loading,
    orders,
    fetchAllOrdersStart,
    fetchAllOrdersSuccess,
    fetchAllOrdersFail,
  } = adminContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchAllOrdersStart();
        const response = await fetch("/api/admin/orders");
        const data = await response.json();
        fetchAllOrdersSuccess(data.orders);
      } catch (error) {
        fetchAllOrdersFail();
      }
    };
    fetchData();
  }, []);
  return (
    <Fragment>
      <HeadTag title='orders'/>
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
                <ListItem selected button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/admin/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </Link>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Orders
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {isDesktop ? (
                            <Fragment>
                              <TableCell>ID</TableCell>
                              <TableCell>USER</TableCell>
                              <TableCell>DATE</TableCell>
                              <TableCell>TOTAL</TableCell>
                              <TableCell>PAID</TableCell>
                              <TableCell>DELIVERED</TableCell>
                              <TableCell>ACTION</TableCell>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <TableCell>ID</TableCell>
                           
                              <TableCell>PAID</TableCell>
                              <TableCell>DELIVERED</TableCell>
                              <TableCell>ACTION</TableCell>
                            </Fragment>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map(order => (
                          <TableRow key={order._id}>
                            {isDesktop ? (
                              <Fragment>
                                <TableCell>
                                  {order._id.substring(20, 24)}
                                </TableCell>
                                <TableCell>
                                  {order.user
                                    ? order.user.map(i => i.name)
                                    : "DELETED USER"}
                                </TableCell>
                                <TableCell>{order.createdAt}</TableCell>
                                <TableCell>${order.totalPrice}</TableCell>
                                <TableCell>
                                  {order.isPaid
                                    ? `paid at ${new Date(
                                        order.paidAt
                                      ).toUTCString()}`
                                    : "not paid"}
                                </TableCell>
                                <TableCell>
                                  {order.isdelivered
                                    ? `delivered at  ${new Date(
                                        order.deliveredAt
                                      ).toUTCString()}`
                                    : "not delivered"}
                                </TableCell>
                                <TableCell>
                                  <Link href={`/order/${order._id}`} passHref>
                                    <Button variant="contained">Details</Button>
                                  </Link>
                                </TableCell>
                              </Fragment>
                            ) : (
                              <Fragment>
                                <TableCell>
                                  {order._id.substring(20, 24)}
                                </TableCell>
                           
                                <TableCell>
                                  {order.isPaid
                                    ? `paid at ${new Date(
                                        order.paidAt
                                      ).toUTCString()}`
                                    : "not paid"}
                                </TableCell>
                                <TableCell>
                                  {order.isdelivered
                                    ? `delivered at  ${new Date(
                                        order.deliveredAt
                                      ).toUTCString()}`
                                    : "not delivered"}
                                </TableCell>
                                <TableCell>
                                  <Link href={`/order/${order._id}`} passHref>
                                    <Button variant="contained">Details</Button>
                                  </Link>
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

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });

