import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";

import rootReducer from "/src/reducers";

const createStoreWithMiddleware = compose(
  applyMiddleware(
    thunkMiddleware
  )
)(createStore);

export default (initialState = {}) => createStoreWithMiddleware(
  rootReducer,
  initialState
);
