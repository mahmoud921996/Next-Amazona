import {
  FETCH_ORDERS_FAIL,
  FETCH_ORDERS_START,
  FETCH_ORDERS_SUCCESS,
} from "../types";

const OrdersReducer = (state, action) => {
  switch (action.type) {
    case FETCH_ORDERS_START:
      return { ...state, loading: true };
    case FETCH_ORDERS_SUCCESS:
      return { ...state, orders: action.payload, loading: false, error: "" };
    case FETCH_ORDERS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default OrdersReducer;
