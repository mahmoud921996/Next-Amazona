import Image from "next/image";
import { Fragment, useContext, useEffect } from "react";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import ProductsContext from "../../store/products/productsContext";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import AdminContext from "../../store/admin/adminContext";
import { useSession } from "next-auth/react";
import classes from "../../styles/style";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dynamic from "next/dynamic";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

function Order(props) {
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();

  const id = props.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const productsContext = useContext(ProductsContext);
  const adminContext = useContext(AdminContext);
  const {
    loadingDeliver,
    successDeliver,
    deliverStart,
    deliverSuccess,
    deliverFail,
    deliverReset,
  } = adminContext;
  const {
    orderInfo,
    loading,
    fetchSuccess,
    fetchFail,
    fetchStart,

    payRequest,
    paySuccess,
    payFail,
    payReset,

    successPay,
  } = productsContext;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        fetchStart();
        const response = await fetch(`/api/orders/${id}`);
        const { data } = await response.json();
        fetchSuccess(data);
      } catch (error) {
        fetchFail(error);
      }
    };

    if (
      !orderInfo._id ||
      (orderInfo._id && orderInfo._id !== id) ||
      successPay ||
      successDeliver
    ) {
      fetchOrder();
      if (successPay) {
        payReset();
      }
      if (successDeliver) {
        deliverReset();
      }
    } else {
      const loadPaypalScript = async () => {
        const response = await fetch("/api/keys/paypal");
        const { clientId } = await response.json();

        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [orderInfo._id, successPay, successDeliver]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: orderInfo.totalPrice },
          },
        ],
      })
      .then(orderID => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        payRequest();
        const response = await fetch(`/api/orders/${orderInfo._id}/pay`, {
          method: "PATCH",
          body: JSON.stringify(details),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        paySuccess();
        enqueueSnackbar(data.message, { variant: "success" });
      } catch (err) {
        payFail(err);
        enqueueSnackbar(err, { variant: "error" });
      }
    });
  }
  function onError(err) {
    console.log(err);
  }

  //deliver handler
  const deliverHandler = async () => {
    try {
      deliverStart();
      const response = await fetch(`/api/orders/${orderInfo._id}/deliver`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      deliverSuccess(data);
    } catch (err) {
      deliverFail(err);
    }
  };

  return (
    <Fragment>
      <HeadTag title={`order ${id}`} />
      <Typography component="h1" variant="h1">
        Order {id}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid item md={9} xs={12}>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Shipping Address
                  </Typography>
                </ListItem>

                <ListItem>
                  {orderInfo.shippingInfo.name},{" "}
                  {orderInfo.shippingInfo.address},{" "}
                  {orderInfo.shippingInfo.city},{" "}
                  {orderInfo.shippingInfo.postalCode},{" "}
                  {orderInfo.shippingInfo.country}
                </ListItem>

                <ListItem>
                  Status:{" "}
                  {orderInfo.isdelivered
                    ? `delivered at ${new Date(
                        orderInfo.deliveredAt
                      ).toUTCString()}`
                    : "not delivered"}
                </ListItem>
              </List>
            </Card>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>paymentMethod :{orderInfo.paymentMethod}</ListItem>
                <ListItem>
                  Status:{" "}
                  {orderInfo.isPaid
                    ? `paid at ${new Date(orderInfo.paidAt).toUTCString()} `
                    : "not paid"}
                </ListItem>
              </List>
            </Card>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderInfo.orderItems.map(item => (
                          <TableRow key={item.name}>
                            <TableCell>
                              <Link href={`/product/${item.slug}`} passHref>
                                <MuiLink>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  ></Image>
                                </MuiLink>
                              </Link>
                            </TableCell>

                            <TableCell>
                              <Link href={`/product/${item.slug}`} passHref>
                                <MuiLink>
                                  <Typography>{item.name}</Typography>
                                </MuiLink>
                              </Link>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>${item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        ${orderInfo.itemsPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        ${orderInfo.taxPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        ${orderInfo.shippingPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>${orderInfo.totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!orderInfo.isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <Box sx={classes.fullWidth}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </Box>
                    )}
                  </ListItem>
                )}
                {session.user.isAdmin &&
                  orderInfo.isPaid &&
                  !orderInfo.isdelivered && (
                    <ListItem>
                      {loadingDeliver && <CircularProgress />}
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={deliverHandler}
                      >
                        Deliver Order
                      </Button>
                    </ListItem>
                  )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
}

export async function getServerSideProps({ params }) {
  const id = params.id;
  return { props: { id } };
}
export default dynamic(() => Promise.resolve(Order), { ssr: false });
