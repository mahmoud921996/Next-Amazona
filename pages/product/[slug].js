import Head from "next/head";
import Link from "next/link";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { getProduct } from "../../lib/data";
import { useContext, useEffect, useState } from "react";
import ProductsContext from "../../store/products/productsContext";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import classes from "../../styles/style";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSnackbar } from "notistack";
const Form = dynamic(() => import("../../components/Form"));
const CardItem = dynamic(() => import("../../components/cardItem"));
const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

function ProductDetail(props) {
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { product } = props;

  const productsContext = useContext(ProductsContext);
  const { addToCart, cart } = productsContext;

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}/reviews`);
      const data = await res.json();
      setReviews(data.product.reviews);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (product) {
      fetchReviews();
    }
  }, []);

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find(x => x.id === product.id);

    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock <= quantity) {
      enqueueSnackbar("Sorry! Item is not in stock", { variant: "error" });
      return;
    }
    addToCart(product, quantity);
    enqueueSnackbar("Item Added To cart", { variant: "success" });
    router.push("/cart");
  };

  const submitHandler = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/products/${product.id}/reviews`,
        {
          method: "POST",
          body: JSON.stringify({ rating, comment }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      enqueueSnackbar(data.message, { variant: "success" });

      setLoading(false);
      fetchReviews();
      // setReviews(data);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err, { variant: "error" });
    }
  };
  if (!product) {
    return <p>No Product Found </p>;
  }
  return (
    <div>
      <HeadTag title={product.name} description={product.description} />
      <Box sx={classes.section}>
        <Link href="/" passHref>
          <MuiLink>
            <Typography> Back to Products</Typography>
          </MuiLink>
        </Link>
      </Box>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography variant="h1" component="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand : {product.brand}</Typography>
            </ListItem>

            <ListItem>
              <Rating value={product.rating} readOnly></Rating>
              <MuiLink href="#reviews">
                <Typography>({product.numReviews} reviews)</Typography>
              </MuiLink>
            </ListItem>
            <ListItem>
              <Typography>Description : {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <CardItem
            x="price"
            price={product.price}
            text="Status"
            handleClick={addToCartHandler}
            val={product.countInStock ? "In Stock" : "unavailable"}
            btnText="Add To Cart"
          />
        </Grid>
      </Grid>
      <List>
        <ListItem>
          <Typography name="reviews" id="reviews" variant="h2">
            Customer Reviews
          </Typography>
        </ListItem>
        {reviews.length === 0 && <ListItem>No review</ListItem>}
        {reviews.map(review => (
          <ListItem key={review._id}>
            <Grid container>
              <Grid item sx={classes.reviewItem}>
                <Typography>
                  <strong>{review.name}</strong>
                </Typography>
                <Typography>{`at ${new Date(review.createdAt)
                  .toUTCString()
                  .substring(0, 17)}`}</Typography>
              </Grid>
              <Grid item>
                <Rating value={review.rating} readOnly></Rating>
                <Typography>{review.comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem>
          {session && (
            <Box
              sx={{
                maxWidth: 800,
                width: "100%",
              }}
            >
              <Form onSubmit={submitHandler}>
                <List>
                  <ListItem>
                    <Typography variant="h2">Leave your review</Typography>
                  </ListItem>
                  <ListItem>
                    <TextField
                      multiline
                      variant="outlined"
                      fullWidth
                      name="review"
                      label="Enter comment"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                    />
                  </ListItem>
                  <ListItem>
                    <Rating
                      name="simple-controlled"
                      value={rating}
                      onChange={e => setRating(e.target.value)}
                    />
                  </ListItem>
                  <ListItem>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>

                    {loading && <CircularProgress></CircularProgress>}
                  </ListItem>
                </List>
              </Form>
            </Box>
          )}
        </ListItem>
      </List>
    </div>
  );
}
export async function getServerSideProps(context) {
  const { params } = context;
  const slug = params.slug;
  const product = await getProduct(slug);
  if (!product) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      product: product,
    },
  };
}

export default ProductDetail;
