import Cookies from "js-cookie";
import {
  ADD_TO_CART,
  CLEAR_CART,
  PAY_FAIL,
  PAY_REQUEST,
  PAY_RESET,
  PAY_SUCCESS,
  REMOVE_ITEM,
  SAVE_PAYMENT_METHOD,
  SAVE_SHIPPING_INFO,
  FETCH_START,
  FETCH_FAIL,
  FETCH_SUCCESS,
} from "../types";

const ProductsReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        item => item.id === newItem.id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map(item =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case REMOVE_ITEM: {
      const cartItems = state.cart.cartItems.filter(
        item => item.id !== action.payload.id
      );
      Cookies.set("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    case SAVE_PAYMENT_METHOD:
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case CLEAR_CART:
      return {
        ...state,
        cart: { ...state.cart, cartItems: []  },
      };
    case FETCH_START:
      return { ...state, loading: true };

    case FETCH_SUCCESS:
      return { ...state, orderInfo: action.payload, error: "", loading: false };
    case FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };

    case PAY_REQUEST:
      return { ...state, loadingPay: true };
    case PAY_SUCCESS:
      return { ...state, loadingPay: false, successPay: true };
    case PAY_FAIL:
      return { ...state, loadingPay: false, errorPay: action.payload };
    case PAY_RESET:
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    default:
      return state;
  }
};
export default ProductsReducer;
