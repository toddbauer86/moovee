import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import custom components
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import SearchMovies from "./pages/SearchMovies";
import SavedMovies from "./pages/SavedMovies";
import Footer from "./components/Footer";

// import GlobalState Provider
import { MooveeGlobal } from "./utils/GlobalState";
import "./index.css";

const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem("id_token");

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  uri: "/graphql",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <MooveeGlobal>
          <div className="app-content bg-light moovee-parent">
            <Navbar />
            <div id="moovee-main">
              <Switch>
                <Route exact path="/" component={Homepage} />
                <Route exact path="/search" component={SearchMovies} />
                <Route exact path="/saved" component={SavedMovies} />
                <Route render={() => <h1>Wrong page!</h1>} />
              </Switch>
            </div>

            <Footer />
          </div>
        </MooveeGlobal>
      </Router>
    </ApolloProvider>
  );
}

export default App;
