import Box from "@mui/material/Box";
import { Fragment, useContext, useEffect, useState } from "react";
import ProductsContext from "../store/products/productsContext";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";

const Form = dynamic(() => import("../components/Form"));
const CheckoutWizard = dynamic(() =>
  import("../components/checkout/CheckoutWizard")
);
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

function PaymentPage() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [method, setMethod] = useState("");
  const router = useRouter();
  const productsContext = useContext(ProductsContext);
  const {
    cart: { paymentMethod, shippingAddress },
    savePaymentMethod,
  } = productsContext;

  useEffect(() => {
    if (paymentMethod && shippingAddress.address) {
      setMethod(paymentMethod);
    } else {
      console.log("Missing Info");
    }
  }, [paymentMethod]);
  const submitHandler = e => {
    e.preventDefault();
    closeSnackbar();

    if (!method) {
      enqueueSnackbar("Payment method is required", { variant: "error" });
    } else {
      savePaymentMethod(method);
      Cookies.set("paymentMethod", JSON.stringify(method));
      router.push("/placeorders");
    }
  };
  return (
    <Fragment>
      <HeadTag title="payment" />
      <CheckoutWizard activeStep={2} />
      <Box sx={{ maxWidth: "800px", margin: "0 auto" }}>
        <Form onSubmit={submitHandler}>
          <Typography component="h1" variant="h1">
            Payment Method
          </Typography>
          <List>
            <ListItem>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="Payment Method"
                  name="paymentMethod"
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                >
                  <FormControlLabel
                    label="Stripe"
                    value="Stripe"
                    control={<Radio />}
                  ></FormControlLabel>
                  <FormControlLabel
                    label="Paypal"
                    value="Paypal"
                    control={<Radio />}
                  ></FormControlLabel>
                  <FormControlLabel
                    label="Cash"
                    value="Cash"
                    control={<Radio />}
                  ></FormControlLabel>
                </RadioGroup>
              </FormControl>
            </ListItem>
            <ListItem>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
              >
                Continue
              </Button>
            </ListItem>
            <ListItem>
              <Button
                color="secondary"
                type="button"
                variant="contained"
                fullWidth
                onClick={() => router.push("/shipping")}
              >
                Back
              </Button>
            </ListItem>
          </List>
        </Form>
      </Box>
    </Fragment>
  );
}
export default PaymentPage;
