import Link from "next/link";
import { Fragment, useContext, useEffect } from "react";
import classes from "../../styles/style";
import AdminContext from "../../store/admin/adminContext";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CircularProgress from "@mui/material/CircularProgress";
import CardContent from "@mui/material/CardContent";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import dynamic from "next/dynamic";

import List from "@mui/material/List";
const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

function Dashboard() {
  const adminContext = useContext(AdminContext);
  const { loading, summary, error, fetchOrdersStart, fetchOrdersSuccess } =
    adminContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchOrdersStart();
        const response = await fetch("/api/admin/summary");
        const data = await response.json();
        fetchOrdersSuccess(data);
      } catch (error) {
        fetchOrdersFail(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Fragment>
      <HeadTag title="Admin Dashboard" />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <Link href="/admin/dashboard" passHref>
                <ListItem selected button component="a">
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
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography sx={classes.error}>{error}</Typography>
                ) : (
                  <Grid
                    container
                    spacing={5}
                    sx={{
                      margin: {
                        xs: "0 auto",
                        md: "initial",
                      },
                    }}
                  >
                    <Grid item md={3} xs={10} sm={6}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            ${summary.ordersPrice}
                          </Typography>
                          <Typography>Sales</Typography>
                        </CardContent>
                        <CardActions>
                          <Link href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              View sales
                            </Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3} xs={10} sm={6}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.ordersCount}
                          </Typography>
                          <Typography>Orders</Typography>
                        </CardContent>
                        <CardActions>
                          <Link href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              View orders
                            </Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3} xs={10} sm={6}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.productsCount}
                          </Typography>
                          <Typography>Products</Typography>
                        </CardContent>
                        <CardActions>
                          <Link href="/admin/products" passHref>
                            <Button size="small" color="primary">
                              View products
                            </Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3} xs={10} sm={6}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.usersCount}
                          </Typography>
                          <Typography>Users</Typography>
                        </CardContent>
                        <CardActions>
                          <Link href="/admin/users" passHref>
                            <Button size="small" color="primary">
                              View users
                            </Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
