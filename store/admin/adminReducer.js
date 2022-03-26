import {
  ADMIN_ORDERS_FAIL,
  ADMIN_ORDERS_SUCCESS,
  ADMIN_ORDERS_START,
  FETCH_ALL_ORDERS_SUCCESS,
  FETCH_ALL_ORDERS_START,
  FETCH_ALL_ORDERS_FAIL,
  DELIVER_START,
  DELIVER_SUCCESS,
  DELIVER_FAIL,
  DELIVER_RESET,
  FETCH_ALL_PRODUCTS_START,
  FETCH_ALL_PRODUCTS_SUCCESS,
  FETCH_ALL_PRODUCTS_FAIL,
  FETCH_ORDER_START,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDER_FAIL,
  UPDATE_REQUEST,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  UPLOAD_REQUEST,
  UPLOAD_SUCCESS,
  UPLOAD_FAIL,
  DELETE_REQUEST,
  DELETE_SUCCESS,
  DELETE_FAIL,
  DELETE_RESET,
  FETCH_ALL_USERS_START,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_ALL_USERS_FAIL,
  FETCH_USER_START,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
} from "../types";
const AdminReducer = (state, action) => {
  switch (action.type) {
    case ADMIN_ORDERS_START:
      return { ...state, loading: true };
    case ADMIN_ORDERS_SUCCESS:
      return { ...state, loading: false, summary: action.payload, error: "" };
    case ADMIN_ORDERS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case FETCH_ALL_ORDERS_START:
      return { ...state, loading: true };
    case FETCH_ALL_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload, error: false };
    case FETCH_ALL_ORDERS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case DELIVER_START:
      return { ...state, loadingDeliver: true };
    case DELIVER_SUCCESS:
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: action.payload,
      };
    case DELIVER_FAIL:
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case DELIVER_RESET:
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: "",
      };
    case FETCH_ALL_PRODUCTS_START:
      return { ...state, loading: true };
    case FETCH_ALL_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: false,
      };
    case FETCH_ALL_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case FETCH_ORDER_START:
      return { ...state, loading: true };
    case FETCH_ORDER_SUCCESS: {
      return { ...state, loading: false, error: false };
    }
    case FETCH_ORDER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_REQUEST:
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case UPDATE_SUCCESS:
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case UPDATE_FAIL:
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case UPLOAD_REQUEST:
      return { ...state, loadingUpload: true, errorUpload: "" };
    case UPLOAD_SUCCESS:
      return { ...state, loadingUpload: false, errorUpload: "" };
    case UPLOAD_FAIL:
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    case DELETE_REQUEST:
      return { ...state, loadingDelete: true };
    case DELETE_SUCCESS:
      return { ...state, loadingDelete: false, successDelete: true };
    case DELETE_FAIL:
      return { ...state, loadingDelete: false };
    case DELETE_RESET:
      return { ...state, loadingDelete: false, successDelete: false };

    case FETCH_ALL_USERS_START:
      return { ...state, loading: true };
    case FETCH_ALL_USERS_SUCCESS:
      return { ...state, loading: false, users: action.payload, error: "" };
    case FETCH_ALL_USERS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case FETCH_USER_START:
      return { ...state, loading: true };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
      };
    case FETCH_USER_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default AdminReducer;
