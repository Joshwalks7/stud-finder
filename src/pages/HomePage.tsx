import type { SubmitEvent } from "react";
import { useState } from "react";
import "./HomePage.css";
import heroImage from "../assets/hero-home.jpg";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedSearch(searchTerm.trim());
  }

  return (
    <div className="home-page">
        <section
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
        >
        <div className="hero-overlay">
            <div className="hero-content">
            <h2>Find Your Next LEGO Build</h2>
            <p>
                Search sets, track your collection, and discover what you can build.
            </p>
            </div>
        </div>
        </section>

      <section className="search-area">
        <h2>Search LEGO Sets</h2>

        <form className="search-controls" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Search by set name or number"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button className="button" type="submit">
            Search
          </button>
        </form>

        {submittedSearch && (
          <p>Searching for: <strong>{submittedSearch}</strong></p>
        )}
      </section>
    </div>
  );
}

export default HomePage;