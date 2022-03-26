import { getSession } from "next-auth/react";
import { Fragment, useState, useContext, useEffect } from "react";
import ProductsContext from "../store/products/productsContext";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
const InpField = dynamic(() => import("../components/InpField"));
const Form = dynamic(() => import("../components/Form"));
const CheckoutWizard = dynamic(() =>
  import("../components/checkout/CheckoutWizard")
);

const HeadTag = dynamic(() => import("../components/layout/HeadTag"));
function Shipping() {
  const router = useRouter();
  const productsContext = useContext(ProductsContext);
  const { saveShippingInfo, cart } = productsContext;
  const { shippingAddress } = cart;
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  useEffect(() => {
    if (shippingAddress) {
      setShippingInfo({ ...shippingAddress });
    }
  }, [shippingAddress]);
  const submitHandler = e => {
    e.preventDefault();
    saveShippingInfo(shippingInfo);
    Cookies.set("shippingInfo", JSON.stringify({ ...shippingInfo }));
    router.push("/payment");
  };
  const changeHandler = e => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };
  return (
    <Fragment>
      <HeadTag title="shipping Address" />
      <CheckoutWizard activeStep={1} />
      <Form onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <InpField
              variant="outlined"
              fullWidth
              id="fullName"
              label="Full Name"
              name="name"
              value={shippingInfo.name}
              onChange={changeHandler}
            />
          </ListItem>
          <ListItem>
            <InpField
              variant="outlined"
              fullWidth
              id="address"
              label="Address"
              name="address"
              value={shippingInfo.address}
              onChange={changeHandler}
            />
          </ListItem>
          <ListItem>
            <InpField
              variant="outlined"
              fullWidth
              id="city"
              label="City"
              value={shippingInfo.city}
              name="city"
              onChange={changeHandler}
            />
          </ListItem>
          <ListItem>
            <InpField
              variant="outlined"
              fullWidth
              id="postalcode"
              label="Postal Code"
              name="postalCode"
              value={shippingInfo.postalCode}
              onChange={changeHandler}
            />
          </ListItem>
          <ListItem>
            <InpField
              variant="outlined"
              fullWidth
              id="country"
              label="Country"
              name="country"
              value={shippingInfo.country}
              onChange={changeHandler}
              
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Continue
            </Button>
          </ListItem>
        </List>
      </Form>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
export default Shipping;
