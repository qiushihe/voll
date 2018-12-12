import { PureComponent } from "react";

class App extends PureComponent {
  render() {
    return (
      <div>
        <h1>It Worked!</h1>
        <webview src="https://www.google.com/" />
      </div>
    );
  }
}

export default App;
