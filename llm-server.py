import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from langchain_ollama.chat_models import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatItem(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    history: List[ChatItem]
    query: str

modelo = ChatOllama(
    model="llama3:8b",
    temperature=0.5
)

prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", "Você é o 'Tecnomind', um assistente de IA especializado em explicar termos de tecnologia. Responda de forma clara e direta."),
    ]
)

cadeia = prompt_template | modelo | StrOutputParser()

def build_langchain_messages(history, query):
    messages = [SystemMessage(content="Você é o 'Tecnomind', um assistente de IA especializado em explicar termos de tecnologia. Responda de forma clara e direta.")]
    
    for item in history:
        if item.role == 'human':
            messages.append(HumanMessage(content=item.content))
        elif item.role == 'ai':
            messages.append(AIMessage(content=item.content))
            
    messages.append(HumanMessage(content=query))
    return messages

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        langchain_messages = build_langchain_messages(request.history, request.query)
        
        resposta = await cadeia.ainvoke({"messages": langchain_messages})
        
        return {"resposta": resposta}
    except Exception as e:
        print(f"Erro no servidor LLM: {e}")
        return {"erro": str(e)}, 500

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5001)