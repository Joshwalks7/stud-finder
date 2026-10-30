import { useCollection } from "../context/CollectionContext";
import "./CollectionPage.css";

function CollectionPage() {
  const {
    collection,
    addToCollection,
    decrementFromCollection,
    removeFromCollection,
  } = useCollection();

  if (collection.length === 0) {
    return (
      <div className="collection-page">
        <h2>My Collection</h2>
        <p>Your collection is empty.</p>
        <p>Search for a set and add it to get started.</p>
      </div>
    );
  }

  return (
    <div className="collection-page">
      <h2>My Collection</h2>

      <div className="collection-list">
        {collection.map((item) => (
          <article
            className="collection-card"
            key={item.set.set_num}
          >
            {item.set.set_img_url && (
              <img
                src={item.set.set_img_url}
                alt={item.set.name}
              />
            )}

            <div className="collection-card-content">
              <h3>{item.set.name}</h3>
              <p>Set number: {item.set.set_num}</p>
              <p>Quantity owned: {item.quantity}</p>

              <div className="collection-actions">
                <button
                  className="button"
                  type="button"
                  onClick={() =>
                    decrementFromCollection(item.set.set_num)
                  }
                >
                  -
                </button>

                <button
                  className="button"
                  type="button"
                  onClick={() => addToCollection(item.set)}
                >
                  +
                </button>

                <button
                  className="button"
                  type="button"
                  onClick={() =>
                    removeFromCollection(item.set.set_num)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CollectionPage;