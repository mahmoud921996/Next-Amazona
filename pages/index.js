import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import { Fragment, useContext } from "react";
import { getAllProducts } from "../lib/data";
import ProductsContext from "../store/products/productsContext";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

const ProductItem = dynamic(() => import("../components/products/productItem"));
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

function Home(props) {
  const router = useRouter();
  const productsContext = useContext(ProductsContext);

  const { cart, addToCart } = productsContext;
  const { enqueueSnackbar } = useSnackbar();
  const addToCartHandler = async product => {
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

  return (
    <Fragment>
      <HeadTag description="Next Amazona E-commerce website for clothes and top brands" />
      <div>
        <Grid container spacing={3}>
          {props.products.map(product => (
            <Grid item md={4} xs={12} sm={6} key={product.name}>
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Fragment>
  );
}

export async function getStaticProps() {
  const products = await getAllProducts();

  return {
    props: {
      products,
    },
  };
}

export default Home;
