import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect } from "react";
import AdminContext from "../../store/admin/adminContext";
import classes from "../../styles/style";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/styles";
const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

function AdminProducts() {
  const router = useRouter();
  const adminContext = useContext(AdminContext);
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const {
    loading,
    products,
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFail,
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
        fetchProductsStart();
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        console.log(data);
        fetchProductsSuccess(data.products);
      } catch (error) {
        fetchProductsFail();
      }
    };
    if (successDelete) {
      deleteReset();
    } else {
      fetchData();
    }
  }, [successDelete]);
  const deleteHandler = async productId => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      deleteRequest();
      const response = await fetch(`/api/admin/products/${productId}`, {
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
      <HeadTag title="products" />
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
                <ListItem selected button component="a">
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
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography component="h1" variant="h1">
                      products
                    </Typography>
                  </Grid>
                  <Grid item xs={6} align="right">
                    <Button
                      sx={{ margin: "10px 0" }}
                      variant="contained"
                      onClick={() => router.push("/admin/product/addproduct")}
                      color="primary"
                    >
                      Create
                    </Button>
                  </Grid>
                </Grid>
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
                              <TableCell>PRICE</TableCell>
                              <TableCell>CATEGORY</TableCell>
                              <TableCell>COUNT</TableCell>
                              <TableCell>RATING</TableCell>
                              <TableCell>ACTIONS</TableCell>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <TableCell>NAME</TableCell>
                              <TableCell>PRICE</TableCell>
                              <TableCell>COUNT</TableCell>
                              <TableCell>ACTIONS</TableCell>
                            </Fragment>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map(product => (
                          <TableRow key={product._id}>
                            {isDesktop ? (
                              <Fragment>
                                <TableCell>
                                  {product._id.substring(20, 24)}
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.countInStock}</TableCell>
                                <TableCell>{product.rating}</TableCell>
                                <TableCell
                                // sx={{
                                //   display: "flex",
                                //   justifyContent: "space-between",
                                //   alignItems: "center",
                                //   flexDirection: {
                                //     xs: "row",
                                //     md: "column",

                                //   },
                                // }}
                                >
                                  <Link
                                    href={`/admin/product/${product._id}`}
                                    passHref
                                  >
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="secondary"
                                      // sx={{
                                      //   marginBottom:{
                                      //     md:'10px',
                                      //     // lg:'initial'
                                      //   }
                                      // }}
                                    >
                                      Edit
                                    </Button>
                                  </Link>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    onClick={() => deleteHandler(product._id)}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </Fragment>
                            ) : (
                              <Fragment>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.countInStock}</TableCell>
                                <TableCell
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Link
                                    href={`/admin/product/${product._id}`}
                                    passHref
                                  >
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="secondary"
                                    >
                                      Edit
                                    </Button>
                                  </Link>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    onClick={() => deleteHandler(product._id)}
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
export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });
