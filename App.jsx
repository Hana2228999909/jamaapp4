import React, { useState } from "react";

const App = () => {
  const [page, setPage] = useState("home");
  const [recipes, setRecipes] = useState([
    { id: 1, name: "Avocado Toast", category: "Breakfast", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600", time: "15 min", overview: "Healthy breakfast rich in fiber.", rating: 0, comments: [] },
    { id: 2, name: "Chicken Salad", category: "Lunch", img: "https://media.istockphoto.com/id/1226733438/photo/salad-with-grilled-chicken-breast-avocado-pomegranate-seeds-and-tomato-on-white-background.jpg?s=612x612&w=0&k=20&c=rS0uf1zRweCGY-FI21a_XpHyVtxOBzuhHWx6ZIAg1go=", time: "30 min", overview: "Light lunch with protein.", rating: 0, comments: [] },
    { id: 3, name: "Pasta Primavera", category: "Dinner", img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600", time: "30 min", overview: "Classic Italian pasta dish.", rating: 0, comments: [] },
    { id: 4, name: "Berry Smoothie", category: "Smoothies", img: "https://media.istockphoto.com/id/1081369140/photo/healthy-appetizing-red-smoothie-dessert-in-glasses.jpg?s=612x612&w=0&k=20&c=ayAj4LQwwNIdY3aJ7fmzzG4HP_vtGboSeiP-FFO6Wm8=", time: "10 min", overview: "Refreshing smoothie full of antioxidants.", rating: 0, comments: [] },
  ]);

  const [newComment, setNewComment] = useState({ user: "", recipeId: 1, comment: "", rating: 0 });
  const [expandedRecipe, setExpandedRecipe] = useState(null); // <-- New state for "More Info"

  const categories = ["Breakfast", "Lunch", "Dinner", "Smoothies"];
  const trendingRecipes = recipes.filter((r) => r.rating >= 4);

  const handleRating = (id, star) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, rating: star } : r))
    );
  };

  const renderStars = (rating, id, clickable = true) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{ cursor: clickable ? "pointer" : "default", color: i <= rating ? "#F4B400" : "#ccc", fontSize: "1rem" }}
          onClick={() => clickable && handleRating(id, i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const addComment = () => {
    if (!newComment.user || !newComment.comment) return;
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === parseInt(newComment.recipeId)
          ? { ...r, comments: [...r.comments, { user: newComment.user, comment: newComment.comment, rating: newComment.rating }] }
          : r
      )
    );
    setNewComment({ ...newComment, comment: "", rating: 0, user: "" });
  };

  const renderRecipeCard = (r) => (
    <div key={r.id} style={{ ...styles.card, position: "relative" }}>
      <img src={r.img} alt={r.name} style={styles.image} />
      <p style={styles.recipeName}>{r.name}</p>
      <p style={styles.recipeOverview}>{r.overview}</p>
      <div style={styles.cardBottom}>
        <p style={styles.recipeTime}>{r.time}</p>
        <div>{renderStars(r.rating, r.id)}</div>
      </div>
      <button 
        style={styles.moreBtn} 
        onClick={() => setExpandedRecipe(expandedRecipe === r.id ? null : r.id)}
      >
        {expandedRecipe === r.id ? "Hide Info ▲" : "More Info ▼"}
      </button>
      {expandedRecipe === r.id && (
        <div style={styles.moreInfo}>
          <p><b>Category:</b> {r.category}</p>
          <p><b>Overview:</b> {r.overview}</p>
          <p><b>Time:</b> {r.time}</p>
          {r.comments.length > 0 && (
            <div>
              <p><b>Comments:</b></p>
              {r.comments.map((c, idx) => (
                <div key={idx} style={styles.commentCard}>
                  <p><b>{c.user}</b> rated: {renderStars(c.rating, 0, false)}</p>
                  <p>{c.comment}</p>
                </div>
              ))}
            </div>
          )}
          {r.comments.length === 0 && <p>No comments yet.</p>}
        </div>
      )}
    </div>
  );

  const renderPage = () => {
    if (page === "home") {
      return (
        <div style={styles.page}>
          <h2 style={styles.heading}>Trending Recipes 🔥</h2>
          {trendingRecipes.length === 0 ? <p>No trending recipes yet.</p> : (
            <div style={styles.recipeList}>
              {trendingRecipes.map(renderRecipeCard)}
            </div>
          )}
          {categories.map((cat) => (
            <div key={cat} style={{ marginTop: "2rem" }}>
              <h3 style={styles.subheading}>{cat}</h3>
              <div style={styles.recipeList}>
                {recipes.filter((r) => r.category === cat).map(renderRecipeCard)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (page === "favorites") {
      const favList = recipes.filter((r) => r.rating >= 4);
      return (
        <div style={styles.page}>
          <h2 style={styles.heading}>Favorite Recipes </h2>
          {favList.length === 0 ? <p> HADA KA HESHAY CUNTADA 5ta XIDIG TAABO.</p> : (
            <div style={styles.recipeList}>
              {favList.map(renderRecipeCard)}
            </div>
          )}
        </div>
      );
    }

    if (page === "about") {
      return (
        <div style={styles.page}>
          <h2 style={styles.heading}>User Feedback 🍴</h2>
          <div style={styles.commentForm}>
            <input
              type="text"
              placeholder="Your Name"
              value={newComment.user}
              onChange={(e) => setNewComment({ ...newComment, user: e.target.value })}
              style={styles.input}
            />
            <select
              value={newComment.recipeId}
              onChange={(e) => setNewComment({ ...newComment, recipeId: e.target.value })}
              style={styles.input}
            >
              {recipes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <textarea
              placeholder="Your Comment"
              value={newComment.comment}
              onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
              style={styles.input}
            />
            <div>Rating: {renderStars(newComment.rating, 0, false).map((star, i) => (
              <span key={i} style={{ cursor: "pointer", fontSize: "1rem", color: i < newComment.rating ? "#F4B400" : "#ccc" }}
                onClick={() => setNewComment({ ...newComment, rating: i + 1 })}
              >★</span>
            ))}</div>
            <button onClick={addComment} style={styles.btn}>Submit Comment</button>
          </div>

          <div style={{ marginTop: "2rem" }}>
            {recipes.map((r) => (
              <div key={r.id}>
                {r.comments.length > 0 && (
                  <>
                    <h3 style={styles.subheading}>{r.name} Comments</h3>
                    {r.comments.map((c, idx) => (
                      <div key={idx} style={styles.commentCard}>
                        <p><b>{c.user}</b> rated: {renderStars(c.rating, 0, false)}</p>
                        <p>{c.comment}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoContainer} onClick={() => setPage("home")}>
          <span style={styles.logoEmoji}>🍲</span>
          <span style={styles.logoText}>Recipe Finder</span>
        </div>
      </header>

      <main style={styles.main}>{renderPage()}</main>

      <footer style={styles.navbar}>
        {["home", "favorites", "about"].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              ...styles.navBtn,
              color: page === p ? "#fff" : "#E4EDE1",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#A8C66C")}
            onMouseLeave={(e) => (e.target.style.color = page === p ? "#fff" : "#E4EDE1")}
          >
            {p === "home" ? " Home" : p === "favorites" ? "Favorites" : "User fdback "}
          </button>
        ))}
      </footer>
    </div>
  );
};

const styles = {
  container: { fontFamily: "'Poppins', sans-serif", backgroundColor: "#F8F9F4", color: "#2F3E34", minHeight: "100vh", display: "flex", flexDirection: "column" },
  header: { backgroundColor: "#2F3E34", padding: "1rem", textAlign: "center", color: "#E4EDE1", boxShadow: "0 3px 6px rgba(0,0,0,0.15)" },
  logoContainer: { display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", cursor: "pointer" },
  logoEmoji: { fontSize: "2rem" },
  logoText: { fontWeight: "700", fontSize: "1.5rem", letterSpacing: "1px" },
  main: { flex: 1, padding: "1rem" },
  heading: { fontSize: "1.8rem", textAlign: "center", marginBottom: "1rem" },
  subheading: { color: "#8b7566ff", marginTop: "1rem" },
  recipeList: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" },
  card: { backgroundColor: "#E4EDE1", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer", paddingBottom: "0.5rem" },
  image: { width: "100%", height: "150px", objectFit: "cover" },
  recipeName: { fontWeight: "700", fontSize: "1.1rem", margin: "5px 0" },
  recipeOverview: { fontSize: "0.9rem", color: "#3A4C3B", marginBottom: "5px" },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 0.8rem" },
  recipeTime: { fontSize: "0.85rem", color: "#5A6650" },
  navbar: { backgroundColor: "#2F3E34", display: "flex", justifyContent: "space-around", padding: "0.8rem 0", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" },
  navBtn: { background: "none", border: "none", fontSize: "1rem", cursor: "pointer", transition: "color 0.2s" },
  page: { textAlign: "center" },
  commentForm: { display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "400px", margin: "0 auto" },
  input: { padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", width: "100%" },
  btn: { padding: "0.5rem", borderRadius: "6px", border: "none", backgroundColor: "#2F3E34", color: "#fff", cursor: "pointer" },
  commentCard: { backgroundColor: "#E4EDE1", padding: "0.5rem 1rem", borderRadius: "8px", margin: "0.5rem 0", textAlign: "left" },
  moreBtn: { marginTop: "0.5rem", padding: "0.3rem 0.5rem", fontSize: "0.85rem", border: "none", borderRadius: "6px", cursor: "pointer", backgroundColor: "#A8C66C", color: "#fff" },
  moreInfo: { marginTop: "0.5rem", padding: "0.5rem", backgroundColor: "#DDE6D0", borderRadius: "8px", textAlign: "left", fontSize: "0.9rem" },
};

export default App;
