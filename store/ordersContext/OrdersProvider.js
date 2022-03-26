const initialState = {
  loading: "",
  orders: [],
  error: "",
};

import { useReducer } from "react";
import {
  FETCH_ORDERS_FAIL,
  FETCH_ORDERS_START,
  FETCH_ORDERS_SUCCESS,
} from "../types";
import OrdersContext from "./ordersContext";
import OrdersReducer from "./ordersReducer";
function OrdersProvider(props) {
  const [state, dispatch] = useReducer(OrdersReducer, initialState);

  const fetchOrdersStart = () => {
    dispatch({ type: FETCH_ORDERS_START });
  };
  const fetchOrdersSuccess = data => {
    dispatch({ type: FETCH_ORDERS_SUCCESS, payload: data });
  };
  const fetchOrdersFail = err => {
    dispatch({ type: FETCH_ORDERS_FAIL, payload: err });
  };
  return (
    <OrdersContext.Provider
      value={{
        loading: state.loading,
        orders: state.orders,
        error: state.error,
        fetchOrdersFail,
        fetchOrdersStart,
        fetchOrdersSuccess,
      }}
    >
      {props.children}
    </OrdersContext.Provider>
  );
}

export default OrdersProvider;
