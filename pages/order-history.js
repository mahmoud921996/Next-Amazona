import Link from "next/link";
import { Fragment, useContext, useEffect } from "react";
import OrdersContext from "../store/ordersContext/ordersContext";
import classes from "../styles/style";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import dynamic from "next/dynamic";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/styles";
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

function OrderHistory() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const ordersContext = useContext(OrdersContext);
  const {
    loading,
    orders,
    error,
    fetchOrdersFail,
    fetchOrdersStart,
    fetchOrdersSuccess,
  } = ordersContext;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        fetchOrdersStart();
        const response = await fetch("api/orders/history");
        const { ordersInfo } = await response.json();
        console.log(ordersInfo);
        fetchOrdersSuccess(ordersInfo);
      } catch (error) {
        console.log(error);
        fetchOrdersFail(error);
      }
    };
    fetchOrders();
  }, []);
  return (
    <Fragment>
      <HeadTag title="order-history" />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <Link href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/order-history" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Order History"></ListItemText>
                </ListItem>
              </Link>
            </List>
          </Card>
        </Grid>
        <Grid md={9} xs={12} item>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Order History
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
                              <TableCell>DATE</TableCell>
                              <TableCell>TOTAL</TableCell>
                              <TableCell>PAID</TableCell>
                              <TableCell>DELIVERED</TableCell>
                              <TableCell>ACTION</TableCell>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <TableCell>ID</TableCell>
                              <TableCell
                                sx={{
                                  display: {
                                    xs: "none",
                                    sm: "block",
                                  },
                                }}
                              >
                                TOTAL
                              </TableCell>
                              <TableCell>PAID</TableCell>
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
                                  {order._id.substring(18, 24)}
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
                                  {order.isDelivered
                                    ? `delivered at ${order.deliveredAt}`
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
                                  {order._id.substring(18, 24)}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    display: {
                                      xs: "none",
                                      sm: "block",
                                    },
                                  }}
                                >
                                  ${order.totalPrice}
                                </TableCell>
                                <TableCell>
                                  {order.isPaid
                                    ? `paid at ${new Date(
                                        order.paidAt
                                      ).toUTCString()}`
                                    : "not paid"}
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

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
