# 🎬 Subtitle-Based Movie Metadata Extraction & Recommendation System

## 📘 Project Overview

This project extracts **movie subtitles** and uses them to generate unbiased movie metadata, including:

- 🎞️ Custom movie **overviews**
- 🏷️ Content-derived **keywords**
- 🎭 Heuristically inferred **genres**

The motivation behind this approach is to eliminate potential bias introduced by movie studios, who may use Blackhat SEO techniques or misleading descriptions to manipulate recommendation systems. By relying solely on subtitle content, we ensure a more **authentic and objective** representation of a movie's narrative.

These synthesized metadata elements are then used to power a **movie recommendation system** that is rooted in actual movie dialogue, not promotional content.

---

## ⚙️ Technologies and Libraries Used

- **Python**
- `pandas` – for CSV and data manipulation  
- `nltk` – for tokenization, stopwords, and sentence parsing  
- `scikit-learn` – for TF-IDF keyword extraction  
- `heapq` – for scoring sentences during summarization  
- `re` – for regex-based subtitle cleaning  
- `tqdm` – for processing progress display  

---

## 📜 Code Description

The code follows these key steps:

1. **NLTK setup:** Ensures required tokenizer and stopword data are available.  
2. **Text Cleaning:** Subtitle text is cleaned to remove timestamps, speaker names, formatting, and special characters.  
3. **Overview Generation:** An extractive summarization technique selects the most informative sentences using word frequency scoring.  
4. **Keyword Extraction:** Uses TF-IDF (or fallback frequency method) to find the most relevant terms.  
5. **Genre Classification:** A heuristic compares subtitle terms against curated genre-specific keyword lists to infer genres.  
6. **Data Aggregation:** Combines all subtitle rows per movie and generates the final dataset.  
7. **Metadata Merging:** Joins the extracted subtitle-based metadata with external metadata using `imdb_id`.  

---

## 📥 Input

- `movies_subtitles.csv`  
  Contains:  
  - `imdb_id`: Movie identifier  
  - `text`: Subtitle lines  

---

## 📤 Output

- `movie_analysis_output.csv`  
  Contains:  
  - `imdb_id`  
  - `overview`: Summary from subtitles  
  - `keywords`: Content-derived tags  
  - `genres`: Inferred genre(s)  

- `merged_movie_data.csv`  
  Merged dataset combining subtitle-based analysis with original movie metadata from `movies_meta.csv`.

---

## 🚀 How It's Used in the Recommendation System

The final output (`merged_movie_data.csv`) is used to drive a **movie recommendation system** that:
- Matches users to films based on actual **spoken content**, not marketing blurbs.
- Avoids bias introduced by studios via SEO or overly broad tagging.
- Supports richer user profiling through accurate, narrative-based metadata.

---

## ✅ Example

**Input:**
```csv
imdb_id,text
tt1234567,"00:00:01,000 --> 00:00:04,000\nHello there!"
tt1234567,"00:00:05,000 --> 00:00:07,000\nHow are you today?"
```

**Output:**
```csv
imdb_id,overview,keywords,genres
tt1234567,"Hello there! How are you today?",hello, today, greeting,Drama
```

---

## 🧩 Final Outcome

After processing the subtitle data and generating unbiased metadata, the project culminates in a fully functional **movie recommendation application**. This system leverages the synthesized insights—overview, keywords, and genres—to suggest movies based on actual narrative content, providing users with **genuine, content-based recommendations**.

---

## 🧪 Steps to Run the Application

1. Clone the repository:
   ```bash
   https://github.com/SreenidhiHayagreevan/Movie-Recomendation/
   ```
2. Navigate to the project directory:
   ```bash
   cd Movie-Recomendation/
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

Access the application at: [[http://localhost:5173/](http://localhost:5173/)](https://main.d3lxxfbzmjdwez.amplifyapp.com)
