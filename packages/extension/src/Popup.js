import React, { useState, useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import AuthnRouter from "./routers/AuthnRouter";
import PopupRouter from "./routers/PopupRouter";
import Authz from "./pages/services/Authz";
import { keyVault } from "./lib/keyVault";
import { loadAccounts } from "./lib/AccountManager";
import "./Popup.css";

function Popup({ fclTabId }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      await keyVault.loadVault();
      await loadAccounts();
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", cancelOnClose);
    return () => {
      window.removeEventListener("beforeunload", cancelOnClose);
    };
  }, []);

  const cancelOnClose = (e) => {
    e.preventDefault();
    chrome.tabs.sendMessage(fclTabId, { type: "FCL:VIEW:CLOSE" });
  };

  if (loading) {
    return null;
  }

  return (
    <Router>
      <Box
        position="absolute"
        w={"375px"}
        h={"600px"}
        p={0}
        m={0}
        background="transparent"
      >
        <Switch>
          <Route exact path="/">
            <PopupRouter />
          </Route>
          <Route exact path="/authn">
            <AuthnRouter fclTabId={fclTabId} />
          </Route>
          <Route exact path="/authz">
            <Authz fclTabId={fclTabId} />
          </Route>
        </Switch>
      </Box>
    </Router>
  );
}

export default Popup;
