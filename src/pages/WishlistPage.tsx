import { useWishlist } from "../context/WishlistContext";
import "./WishlistPage.css";

function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="wishlist-page">
                <h2>Wishlist</h2>
                <p>Your wishlist is empty</p>
                <p>Search for a set and add it to get started</p>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <h2>Wishlist</h2>

            <div className="wishlist-list">
                {wishlist.map((item) => (
                    <article className="wishlist-card" key={item.set.set_num}>
                        {item.set.set_img_url && (
                            <img src={item.set.set_img_url} alt={item.set.name} />
                        )}

                        <div className="wishlist-card-content">
                            <h3>Set number: {item.set.set_num}</h3>
                            <p>Released: {item.set.year}</p>
                            <p>Pieces: {item.set.num_parts}</p>

                            <div className="wishlist-actions">
                                <a className="button" href={item.set.set_url} target="_blank" rel="noreferrer">
                                    View on Rebrickable
                                </a>

                                <button className="button" type="button" onClick={() => removeFromWishlist(item.set.set_num)}>
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

export default WishlistPage;