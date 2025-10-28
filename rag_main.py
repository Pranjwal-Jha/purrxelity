from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.tools.retriever import create_retriever_tool

## generate_embedding function redundant remove it in later version
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
vectordb = Chroma(embedding_function=embeddings, persist_directory="./chroma_db")


def generate_embedding():
    loader = PyPDFLoader("fictional_gym.pdf")
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
    texts = text_splitter.split_documents(documents)
    vectordb.add_documents(texts)


def rag_tool():
    """
    Sets up a retriever tool that searches user-uploaded documents
    and returns the top 3 relevant results using MMR search.
    """
    retriever = vectordb.as_retriever(search_type="mmr", search_kwargs={"k": 3})
    retriever_tool = create_retriever_tool(
        retriever=retriever,
        name="user_document_retriever_tool",
        description="searches and returns information about user provided document",
    )
    return [retriever_tool]


if __name__ == "__main__":
    generate_embedding()
