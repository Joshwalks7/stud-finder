import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import WishlistPage from "./pages/WishlistPage";
import ExplorePage from "./pages/ExplorePage";
import AuthPage from "./pages/AuthPage";
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Stud Finder</h1>
        <p>If you're gonna spend money, at least do it responsibly</p>
      </header>

      <nav className="main-nav" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/collection">My Collection</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/account">Account</Link>
      </nav>
      <section className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/account" element={<AuthPage />} />
        </Routes>
      </section>
    </main>
  );
}

export default App;
