import type { SubmitEvent } from "react";
import { useState } from "react";
import heroImage from "../assets/hero-home.jpg";
import { searchSets } from "../services/rebrickableApi";
import type { RebrickableSet } from "../types/rebrickable";
import "./HomePage.css";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [sets, setSets] = useState<RebrickableSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchTerm.trim();

    if (!query) {
      return;
    }

    setSubmittedSearch(query);
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await searchSets(query);
      setSets(data.results);
    } catch (error) {
      setSets([]);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong while searching.");
      }
    } finally {
      setIsLoading(false);
    }
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

        {isLoading && <p>Searching for LEGO sets...</p>}

        {errorMessage && <p role="alert">{errorMessage}</p>}

        {submittedSearch && !isLoading && !errorMessage && (
          <p>Results for: <strong>{submittedSearch}</strong></p>
        )}
      </section>

      {!isLoading && !errorMessage && sets.length > 0 && (
        <section className="results-section">
          <h2>Search Results</h2>

          <div className="set-grid">
            {sets.map((set) => (
              <article className="set-card" key={set.set_num}>
                {set.set_img_url && (
                  <img src={set.set_img_url} alt={set.name} />
                )}

                <div className="set-card-content">
                  <h3>{set.name}</h3>
                  <p>Set number: {set.set_num}</p>
                  <p>Released: {set.year}</p>
                  <p>Pieces: {set.num_parts}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;