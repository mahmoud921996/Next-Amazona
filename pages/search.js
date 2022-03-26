import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuItem from "@mui/material/MenuItem";
import dynamic from "next/dynamic";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import { useRouter } from "next/router";
import { Fragment, useContext } from "react";
import { connectToDatabase } from "../lib/data";
import ProductsContext from "../store/products/productsContext";
import classes from "../styles/style";
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

const ProductItem = dynamic(() => import("../components/products/productItem"));

const PAGE_SIZE = 3;
const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];
const ratings = [1, 2, 3, 4, 5];
function Search(props) {
  const router = useRouter();
  const productsContext = useContext(ProductsContext);

  const { cart, addToCart } = productsContext;
  const {
    query = "all",
    category = "all",
    brand = "all",
    price = "all",
    rating = "all",
    sort = "featured",
  } = router.query;
  const { products, countProducts, categories, brands, pages } = props;

  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;
    router.push({
      pathname: path,
      query: query,
    });
  };

  const categoryHandler = e => {
    filterSearch({ category: e.target.value });
  };
  const pageHandler = (e, page) => {
    filterSearch({ page });
  };
  const brandHandler = e => {
    filterSearch({ brand: e.target.value });
  };
  const sortHandler = e => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = e => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = e => {
    filterSearch({ rating: e.target.value });
  };

  const addToCartHandler = async product => {
    const existItem = cart.cartItems.find(x => x.id === product.id);

    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock <= quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <Fragment>
      <HeadTag title="search" />
      <Grid container spacing={1} sx={classes.section}>
        <Grid item xs={6} sm={3}>
          <List>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Categories</Typography>
                <Select fullWidth value={category} onChange={categoryHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {categories &&
                    categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Brands</Typography>
                <Select value={brand} onChange={brandHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {brands &&
                    brands.map(brand => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Prices</Typography>
                <Select value={price} onChange={priceHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {prices.map(price => (
                    <MenuItem key={price.value} value={price.value}>
                      {price.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Ratings</Typography>
                <Select value={rating} onChange={ratingHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {ratings.map(rating => (
                    <MenuItem dispaly="flex" key={rating} value={rating}>
                      <Rating value={rating} readOnly />
                      <Typography component="span">&amp; Up</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {products.length === 0 ? "No" : countProducts} Results
              {query !== "all" && query !== "" && " : " + query}
              {category !== "all" && " : " + category}
              {brand !== "all" && " : " + brand}
              {price !== "all" && " : Price " + price}
              {rating !== "all" && " : Rating " + rating + " & up"}
              {(query !== "all" && query !== "") ||
              category !== "all" ||
              brand !== "all" ||
              rating !== "all" ||
              price !== "all" ? (
                <Button onClick={() => router.push("/search")}>
                  <CancelIcon />
                </Button>
              ) : null}
            </Grid>
            <Grid item>
              <Typography component="span" sx={classes.sort}>
                Sort by
              </Typography>
              <Select value={sort} onChange={sortHandler}>
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="lowest">Price: Low to High</MenuItem>
                <MenuItem value="highest">Price: High to Low</MenuItem>
                <MenuItem value="toprated">Customer Reviews</MenuItem>
                <MenuItem value="newest">Newest Arrivals</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={classes.section}>
            {products.map(product => (
              <Grid item md={4} xs={12} sm={6} key={product.name}>
                <ProductItem
                  product={product}
                  addToCartHandler={addToCartHandler}
                />
              </Grid>
            ))}
          </Grid>
          <Pagination
            sx={classes.section}
            defaultPage={parseInt(query.page || "1")}
            count={pages}
            onChange={pageHandler}
          ></Pagination>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export async function getServerSideProps({ query }) {
  const client = await connectToDatabase();
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const brand = query.brand || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const sort = query.sort || "";
  const searchQuery = query.query || "";

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};
  const categoryFilter = category && category !== "all" ? { category } : {};
  const brandFilter = brand && brand !== "all" ? { brand } : {};
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};

  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};

  const order =
    sort === "featured"
      ? { featured: -1 }
      : sort === "lowest"
      ? { price: 1 }
      : sort === "highest"
      ? { price: -1 }
      : sort === "toprated"
      ? { rating: -1 }
      : sort === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  const categories = await client.db().collection("data").distinct("category");
  const brands = await client.db().collection("data").distinct("brand");
  const productDocs = client
    .db()
    .collection("data")
    .find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...brandFilter,
        ...ratingFilter,
      },
      "-reviews"
    )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await client
    .db()
    .collection("data")
    .countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...brandFilter,
      ...ratingFilter,
    });

  const products = await productDocs.toArray();

  const Allproducts = products.map(item => ({
    id: item._id.toString(),
    name: item.name,
    slug: item.slug,
    category: item.category,
    image: item.image,
    price: item.price,
    brand: item.brand,
    rating: item.rating ? item.rating : "",
    numReviews: item.numReviews ? item.numReviews : "",
    countInStock: item.countInStock,
    description: item.description,
  }));

  return {
    props: {
      products: Allproducts,
      countProducts,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
    },
  };
}
export default Search;
