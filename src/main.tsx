import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CollectionProvider } from "./context/CollectionContext";
import { WishlistProvider } from "./context/WishlistContext";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CollectionProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CollectionProvider>
    </BrowserRouter>
  </StrictMode>,
);