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
          <div className="app-content bg-light" style={{ height: "93vh" }}>
            <Navbar />
            <Switch>
              <Route exact path="/" component={Homepage} />
              <Route exact path="/search" component={SearchMovies} />
              <Route exact path="/saved" component={SavedMovies} />
              <Route
                render={() => <h1 className="display-2">Wrong page!</h1>}
              />
            </Switch>
          </div>

          <Footer />
        </MooveeGlobal>
      </Router>
    </ApolloProvider>
  );
}

export default App;
