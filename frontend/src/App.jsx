import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendQuery = async () => {
  if (!query.trim()) return;

  setLoading(true);

  try {
    const res = await axios.post("https://filmfitai.onrender.com/chat", {
      query: query,
    });

    setResponse(res.data.response);
    setQuery("");
  } catch (error) {
    console.log(error);
    setResponse("Something went wrong.");
  }

  setLoading(false);
};

  return (
    <div className="app">

      <header className="navbar">
        <h1>🎬 FilmFitAI</h1>
      </header>

      <section className="hero">
        <h2>Find Your Next Favorite Movie</h2>
        <p>
          Ask anything like:
          <br />
          <span>"Suggest thriller movies"</span>
        </p>

        <div className="searchBox">
          <input
            type="text"
            placeholder="Ask for movie recommendations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button onClick={sendQuery}>
            Recommend
          </button>
        </div>
      </section>

      <section className="resultSection">

        <h2>🤖 AI Recommendations</h2>

        {loading ? (
          <div className="loading">
            Generating recommendations...
          </div>
        ) : (
          <div className="responseCard">
            <pre>{response}</pre>
          </div>
        )}

      </section>

    </div>
  );
}

export default App;