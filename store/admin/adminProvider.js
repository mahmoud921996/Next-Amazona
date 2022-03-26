import { useReducer } from "react";
import {
  ADMIN_ORDERS_FAIL,
  ADMIN_ORDERS_START,
  ADMIN_ORDERS_SUCCESS,
  CREATE_FAIL,
  CREATE_REQUEST,
  CREATE_SUCCESS,
  DELETE_FAIL,
  DELETE_REQUEST,
  DELETE_RESET,
  DELETE_SUCCESS,
  DELIVER_FAIL,
  DELIVER_RESET,
  DELIVER_START,
  DELIVER_SUCCESS,
  FETCH_ALL_ORDERS_FAIL,
  FETCH_ALL_ORDERS_START,
  FETCH_ALL_ORDERS_SUCCESS,
  FETCH_ALL_PRODUCTS_FAIL,
  FETCH_ALL_PRODUCTS_START,
  FETCH_ALL_PRODUCTS_SUCCESS,
  FETCH_ALL_USERS_FAIL,
  FETCH_ALL_USERS_START,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_ORDER_FAIL,
  FETCH_ORDER_START,
  FETCH_ORDER_SUCCESS,
  FETCH_USER_FAIL,
  FETCH_USER_START,
  FETCH_USER_SUCCESS,
  UPDATE_FAIL,
  UPDATE_REQUEST,
  UPDATE_SUCCESS,
  UPLOAD_FAIL,
  UPLOAD_REQUEST,
  UPLOAD_SUCCESS,
} from "../types";
import AdminContext from "./adminContext";
import AdminReducer from "./adminReducer";
const initialState = {
  loading: true,
  summary: { salesData: [] },
  error: "",
  orders: [],
  loadingDeliver: false,
  users: "",
  errorDeliver: "",
  successDeliver: false,
  products: [],
  loadingUpdate: "",
  errorUpdate: "",
  loadingUpload: false,
  errorUpload: "",
  loadingCreate: false,
  loadingDelete: "",
  successDelete: "",
};
const AdminProvider = props => {
  const [state, dispatch] = useReducer(AdminReducer, initialState);

  const fetchOrdersStart = () => {
    dispatch({ type: ADMIN_ORDERS_START });
  };
  const fetchOrdersSuccess = data => {
    dispatch({ type: ADMIN_ORDERS_SUCCESS, payload: data });
  };
  const fetchOrdersFail = error => {
    dispatch({ type: ADMIN_ORDERS_FAIL, payload: error });
  };

  const fetchAllOrdersStart = () => {
    dispatch({ type: FETCH_ALL_ORDERS_START });
  };
  const fetchAllOrdersSuccess = data => {
    dispatch({ type: FETCH_ALL_ORDERS_SUCCESS, payload: data });
  };
  const fetchAllOrdersFail = error => {
    dispatch({ type: FETCH_ALL_ORDERS_FAIL, payload: error });
  };

  const fetchUsersRequest = () => {
    dispatch({ type: FETCH_ALL_USERS_START });
  };
  const fetchUsersSuccess = data => {
    dispatch({ type: FETCH_ALL_USERS_SUCCESS, payload: data });
  };
  const fetchUsersFail = err => {
    dispatch({ type: FETCH_ALL_USERS_FAIL, payload: err });
  };
  const deliverStart = () => {
    dispatch({ type: DELIVER_START });
  };
  const deliverSuccess = data => {
    dispatch({ type: DELIVER_SUCCESS, payload: data });
  };
  const deliverFail = err => {
    dispatch({ type: DELIVER_FAIL, payload: err });
  };
  const deliverReset = () => {
    dispatch({ type: DELIVER_RESET });
  };

  const fetchProductsStart = () => {
    dispatch({ type: FETCH_ALL_PRODUCTS_START });
  };
  const fetchProductsSuccess = data => {
    dispatch({ type: FETCH_ALL_PRODUCTS_SUCCESS, payload: data });
  };
  const fetchProductsFail = error => {
    dispatch({ type: FETCH_ALL_PRODUCTS_FAIL, payload: error });
  };

  const fetchOrderStart = () => {
    dispatch({ type: FETCH_ORDER_START });
  };
  const fetchOrderSuccess = () => {
    dispatch({ type: FETCH_ORDER_SUCCESS });
  };
  const fetchOrderFail = err => {
    dispatch({ type: FETCH_ORDER_FAIL, payload: err });
  };
  const updateRequest = () => {
    dispatch({ type: UPDATE_REQUEST });
  };
  const updateSuccess = () => {
    dispatch({ type: UPDATE_SUCCESS });
  };
  const updateFail = error => {
    dispatch({ type: UPDATE_FAIL, payload: error });
  };

  const uploadRequest = () => {
    dispatch({ type: UPLOAD_REQUEST });
  };
  const uploadSuccess = () => {
    dispatch({ type: UPLOAD_SUCCESS });
  };
  const uploadFail = error => {
    dispatch({ type: UPLOAD_FAIL, payload: error });
  };

  const createRequest = () => {
    dispatch({ type: CREATE_REQUEST });
  };
  const createSuccess = () => {
    dispatch({ type: CREATE_SUCCESS });
  };
  const createFail = () => {
    dispatch({ type: CREATE_FAIL });
  };

  const deleteRequest = () => {
    dispatch({ type: DELETE_REQUEST });
  };
  const deleteSuccess = () => {
    dispatch({ type: DELETE_SUCCESS });
  };
  const deleteFail = () => {
    dispatch({ type: DELETE_FAIL });
  };
  const deleteReset = () => {
    dispatch({ type: DELETE_RESET });
  };

  const fetchUserStart = () => {
    dispatch({ type: FETCH_USER_START });
  };
  const fetchUserSuccess = () => {
    dispatch({ type: FETCH_USER_SUCCESS });
  };
  const fetchUserFail = err => {
    dispatch({ type: FETCH_USER_FAIL, payload: err });
  };

  return (
    <AdminContext.Provider
      value={{
        fetchUserStart,
        fetchUserSuccess,
        fetchUserFail,
        fetchUsersRequest,
        fetchUsersSuccess,
        fetchUsersFail,
        users: state.users,
        createRequest,
        createSuccess,
        createFail,
        loadingCreate: state.loadingCreate,
        deleteRequest,
        deleteSuccess,
        deleteFail,
        deleteReset,
        loadingDelete: state.loadingDelete,
        successDelete: state.successDelete,
        uploadRequest,
        uploadSuccess,
        uploadFail,
        loadingUpload: state.loadingUpload,
        errorUpload: state.errorUpload,
        loadingUpdate: state.loadingUpdate,
        errorUpdate: state.errorUpdate,
        updateRequest,
        updateSuccess,
        updateFail,
        fetchOrderStart,
        fetchOrderSuccess,
        fetchOrderFail,
        loading: state.loading,
        summary: state.summary,
        error: state.error,
        fetchOrdersStart,
        fetchOrdersSuccess,
        fetchOrdersFail,
        orders: state.orders,
        fetchAllOrdersStart,
        fetchAllOrdersSuccess,
        fetchAllOrdersFail,
        loadingDeliver: state.loadingDeliver,
        errorDeliver: state.errorDeliver,
        successDeliver: state.successDeliver,
        deliverStart,
        deliverSuccess,
        deliverFail,
        deliverReset,
        products: state.products,
        fetchProductsStart,
        fetchProductsSuccess,
        fetchProductsFail,
      }}
    >
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminProvider;
