import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loadBuildability } from "../services/buildabilityApi";
import type { BuildabilitySummary } from "../types/inventory";
import "./ExplorePage.css";

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [setInput, setSetInput] = useState(searchParams.get("set") ?? "");
  const [summary, setSummary] = useState<BuildabilitySummary | null>(null);
  const [loadedSet, setLoadedSet] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorSet, setErrorSet] = useState<string | null>(null);
  const { user, isLoading: isAuthLoading } = useAuth();
  const targetSet = searchParams.get("set")?.trim() ?? "";

  useEffect(() => {
    if (!targetSet || isAuthLoading || !user) {
      return;
    }

    let isCurrentRequest = true;

    loadBuildability(targetSet)
      .then((result) => {
        if (isCurrentRequest) {
          setSummary(result);
          setLoadedSet(targetSet);
        }
      })
      .catch((error: unknown) => {
        if (isCurrentRequest) {
          setLoadedSet(null);
          setErrorSet(targetSet);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Buildability is currently unavailable.",
          );
        }
      })
      .finally(() => {
        // The request state is derived from loadedSet and errorSet.
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [isAuthLoading, targetSet, user]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedSet = setInput.trim();

    if (!normalizedSet) {
      setSummary(null);
      setLoadedSet(null);
      setErrorSet(null);
      setErrorMessage("");
      setSearchParams({});
      return;
    }

    setSummary(null);
    setLoadedSet(null);
    setErrorSet(null);
    setErrorMessage("");
    setSearchParams({ set: normalizedSet });
  }

  const missingParts = summary?.parts.filter((part) => part.missing > 0) ?? [];
  const isLoading = Boolean(
    targetSet && user && loadedSet !== targetSet && errorSet !== targetSet,
  );

  return (
    <div className="explore-page">
      <section className="explore-intro">
        <p className="eyebrow">Collection builder</p>
        <h2>Explore what you can build</h2>
        <p>
          Enter a set number to compare its required pieces with your
          collection.
        </p>
      </section>

      <section className="explore-search" aria-labelledby="explore-search-title">
        <h2 id="explore-search-title">Check a LEGO set</h2>
        <form className="explore-form" onSubmit={handleSubmit}>
          <label htmlFor="target-set">Set number</label>
          <div className="explore-form-controls">
            <input
              id="target-set"
              type="search"
              placeholder="Example: 75192-1"
              value={setInput}
              onChange={(event) => setSetInput(event.target.value)}
            />
            <button className="button" type="submit">
              Compare
            </button>
          </div>
        </form>
      </section>

      {isAuthLoading && <p>Checking your sign-in...</p>}

      {!isAuthLoading && !user && (
        <p className="explore-message" role="status">
          Sign in to compare a set with your collection.
        </p>
      )}

      {!isAuthLoading && user && !targetSet && (
        <p className="explore-message" role="status">
          Enter a set number above to begin.
        </p>
      )}

      {isLoading && (
        <p className="explore-message" role="status" aria-live="polite">
          Comparing pieces in your collection...
        </p>
      )}

      {errorMessage && errorSet === targetSet && (
        <p className="explore-message explore-error" role="alert">
          {errorMessage}
        </p>
      )}

      {summary && loadedSet === targetSet && !isLoading && errorSet !== targetSet && (
        <section className="comparison-results" aria-live="polite">
          <div className="comparison-heading">
            <div>
              <p className="eyebrow">Set {targetSet}</p>
              <h2>Buildability summary</h2>
            </div>
            <strong className="comparison-percentage">
              {summary.percentage}%
            </strong>
          </div>

          <progress
            max="100"
            value={summary.percentage}
            aria-label={`${summary.percentage}% of set ${targetSet} can be built`}
          />

          <dl className="comparison-counts">
            <div>
              <dt>Required</dt>
              <dd>{summary.requiredPieces}</dd>
            </div>
            <div>
              <dt>Available</dt>
              <dd>{summary.availablePieces}</dd>
            </div>
            <div>
              <dt>Usable</dt>
              <dd>{summary.usedPieces}</dd>
            </div>
            <div>
              <dt>Missing</dt>
              <dd>{summary.missingPieces}</dd>
            </div>
          </dl>

          <div className="missing-parts">
            <h3>Missing parts</h3>
            {missingParts.length === 0 ? (
              <p>You have all the required pieces for this comparison.</p>
            ) : (
              <ul>
                {missingParts.map((part) => (
                  <li key={part.key}>
                    <span>{part.key}</span>
                    <strong>{part.missing} missing</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default ExplorePage;
