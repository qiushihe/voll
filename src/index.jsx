import { render } from "react-dom";
import { Provider } from "react-redux";

import createStore from "/src/store/create";
import App from "/src/components/app";

const Root = () => (
  <Provider store={createStore()}>
    <App />
  </Provider>
);

render(<Root />, document.getElementById("root"));
