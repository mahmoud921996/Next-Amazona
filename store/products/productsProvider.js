import Cookies from "js-cookie";
import { useReducer } from "react";
import {
  ADD_TO_CART,
  REMOVE_ITEM,
  SAVE_SHIPPING_INFO,
  SAVE_PAYMENT_METHOD,
  CLEAR_CART,
  PAY_REQUEST,
  PAY_SUCCESS,
  PAY_FAIL,
  PAY_RESET,
  FETCH_FAIL,
  FETCH_START,
  FETCH_SUCCESS,
} from "../types";
import ProductsContext from "./productsContext";
import ProductsReducer from "./productsReducer";

const initialState = {
  cart: {
    cartItems: Cookies.get("cartItems")
      ? JSON.parse(Cookies.get("cartItems"))
      : [],

    shippingAddress: Cookies.get("shippingInfo")
      ? JSON.parse(Cookies.get("shippingInfo"))
      : {},
    paymentMethod: Cookies.get("paymentMethod")
      ? JSON.parse(Cookies.get("paymentMethod"))
      : "",
  },
  orderInfo: {},
  loading: true,
  error: "",
  loadingPay: "",
  successPay: "",
  errorPay: "",
};

function ProductsState(props) {
  const [state, dispatch] = useReducer(ProductsReducer, initialState);

  const addToCart = (product, quantity) => {
    dispatch({ type: ADD_TO_CART, payload: { ...product, quantity } });
  };

  const updateCart = (item, quantity) => {
    dispatch({ type: ADD_TO_CART, payload: { ...item, quantity } });
  };

  const removeItem = item => {
    dispatch({ type: REMOVE_ITEM, payload: { ...item } });
  };

  const saveShippingInfo = info => {
    dispatch({ type: SAVE_SHIPPING_INFO, payload: { ...info } });
  };

  const savePaymentMethod = method => {
    dispatch({ type: SAVE_PAYMENT_METHOD, payload: method });
  };
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const payRequest = () => {
    dispatch({ type: PAY_REQUEST });
  };
  const paySuccess = () => {
    dispatch({ type: PAY_SUCCESS });
  };
  const payFail = () => {
    dispatch({ type: PAY_FAIL });
  };
  const payReset = () => {
    dispatch({ type: PAY_RESET });
  };

  const fetchStart = () => {
    dispatch({ type: FETCH_START });
  };
  const fetchSuccess = data => {
    dispatch({ type: FETCH_SUCCESS, payload: data });
  };
  const fetchFail = err => {
    dispatch({ type: FETCH_FAIL, payload: err });
  };
  return (
    <ProductsContext.Provider
      value={{
        cart: state.cart,
        orderInfo: state.orderInfo,
        loading: state.loading,
        error: state.error,
        loadingPay: state.loadingPay,
        successPay: state.successPay,
        errorPay: state.errorPay,
        addToCart,
        updateCart,
        removeItem,
        saveShippingInfo,
        savePaymentMethod,
        clearCart,
        payReset,
        payRequest,
        paySuccess,
        payFail,
        fetchSuccess,
        fetchFail,
        fetchStart,
      }}
    >
      {props.children}
    </ProductsContext.Provider>
  );
}

export default ProductsState;
