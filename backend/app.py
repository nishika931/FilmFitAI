from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os

# Load API key
load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Groq Model
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY")
)

# Prompt Template
prompt = PromptTemplate.from_template("""
You are FilmFitAI, an AI Movie Recommendation Assistant.

Your job is to recommend movies based on the user's request.

Instructions:
- Recommend 5 movies.
- Mention the genre.
- Give one-line reasons for each recommendation.
- Keep the response simple and attractive.

User Query:
{query}
""")

# Output Parser
parser = StrOutputParser()

# LangChain LCEL Chain
chain = prompt | llm | parser


@app.get("/")
def home():
    return {"message": "FilmFitAI Backend Running"}


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()

    query = data.get("query")

    answer = chain.invoke({
        "query": query
    })

    return {
        "response": answer
    }