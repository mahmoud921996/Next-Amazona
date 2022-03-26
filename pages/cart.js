import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Fragment, useContext } from "react";
import ProductsContext from "../store/products/productsContext";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import MuiLink from "@mui/material/Link";
const CardItem = dynamic(() => import("../components/cardItem"));
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

function CartPage() {
  const router = useRouter();
  const productsContext = useContext(ProductsContext);
  const { cart, removeItem, addToCart } = productsContext;

  if (cart.cartItems.length === 0) {
    return (
      <div>
        Cart is empty. <Link href="/">Go shopping</Link>
      </div>
    );
  }
  const updateCartHandler = async (item, quantity) => {
    if (item.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    addToCart(item, quantity);
  };

  const removeItemHandler = item => {
    removeItem(item);
  };

  const handleClick = () => {
    router.push("/shipping");
  };
  return (
    <Fragment>
      <HeadTag title="shopping cart" />
      <Box>
        <Typography component="h1" variant="h1">
          Shopping Cart
        </Typography>
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        display: {
                          xs: "none",
                          sm: "block",
                        },
                      }}
                    >
                      Image
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.cartItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell
                        sx={{
                          display: {
                            xs: "none",
                            sm: "block",
                          },
                        }}
                      >
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
                        <Select
                          value={item.quantity}
                          onChange={e =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map(x => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">${item.price}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeItemHandler(item)}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <CardItem
              x="Subtotal"
              price={cart.cartItems.reduce(
                (a, c) => a + c.quantity * c.price,
                0
              )}
              text="item"
              handleClick={handleClick}
              val={cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
              btnText="Check out"
            />
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}
export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
