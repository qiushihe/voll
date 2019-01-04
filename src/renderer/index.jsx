import { render } from "react-dom";
import { Provider } from "react-redux";

import createStore from "/renderer/store/create";
import App from "/renderer/components/app";

import "typeface-roboto/index.css"

const Root = () => (
  <Provider store={createStore()}>
    <App />
  </Provider>
);

render(<Root />, document.getElementById("root"));
