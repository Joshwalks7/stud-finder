import "../HomePage.css";
import heroImage from "../assets/hero-home.jpg";

function HomePage() {
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

        <div className="search-controls">
          <input
            type="search"
            placeholder="Search by set name or number"
          />
          <button className="button" type="button">
            Search
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;