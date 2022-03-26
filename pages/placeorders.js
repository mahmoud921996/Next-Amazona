import Image from "next/image";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import { Fragment, useContext, useState } from "react";
import ProductsContext from "../store/products/productsContext";
import { useRouter } from "next/router";
import classes from "../styles/style";
import { useSession } from "next-auth/react";
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
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
const CheckoutWizard = dynamic(() =>
  import("../components/checkout/CheckoutWizard")
);
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

import { useSnackbar } from "notistack";

function OrderPage() {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const productsContext = useContext(ProductsContext);
  const {
    cart: { shippingAddress, paymentMethod, cartItems },
    clearCart,
  } = productsContext;

  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const taxPrice = itemsPrice * 0.15;
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const order = {
    orderItems: cartItems,
    shippingInfo: shippingAddress,
    paymentMethod: paymentMethod,
    itemsPrice: itemsPrice,
    shippingPrice: shippingPrice,
    taxPrice: taxPrice,
    totalPrice: totalPrice,
    isPaid: false,
    isDelivered: false,
    userId: session.user.id,
    createdAt: new Date(),
  };

  const submitHandler = async () => {
    closeSnackbar();

    try {
      setLoading(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      clearCart();
      Cookies.remove("cartItems");
      setLoading(false);
      router.push(`/order/${data.order.id}`);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error, { variant: "error" });
    }
  };
  return (
    <Fragment>
      <HeadTag title="placeorder" />
      <CheckoutWizard activeStep={3} />
      <Typography component="h1" variant="h1">
        Place Order
      </Typography>
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
                {shippingAddress.name} , {shippingAddress.address} ,
                {shippingAddress.city},{shippingAddress.postalCode} ,{" "}
                {shippingAddress.country}
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
              <ListItem>{paymentMethod}</ListItem>
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
                      {cartItems.map(item => (
                        <TableRow key={item.id}>
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
                    <Typography align="right">${itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${taxPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${shippingPrice}</Typography>
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
                      <strong>${totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={submitHandler}
                >
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
export default dynamic(() => Promise.resolve(OrderPage), { ssr: false });
