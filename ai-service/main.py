from fastapi import FastAPI
from pydantic import BaseModel

from vector_store import save_chunks_to_db, delete_chunks_by_document, count_chunks_for_document
from document_processor import process_document
from vector_store import save_chunks_to_db
from qa_engine import answer_question

app = FastAPI(title="DocuMind AI Service")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "documind-ai-service"}


class IngestRequest(BaseModel):
    file_path: str


@app.post("/ai/ingest")
def ingest_document(request: IngestRequest):
    try:
        chunks = process_document(request.file_path)

        # If no text could be read (for example a scanned PDF), stop here
        if len(chunks) == 0:
            return {
                "status": "failed",
                "error": "No readable text found in this file. It may be a scanned or image-only PDF."
            }

        save_chunks_to_db(chunks)

        # Double-check that every chunk was really stored
        saved_count = count_chunks_for_document(request.file_path)
        if saved_count != len(chunks):
            return {
                "status": "failed",
                "error": "Only " + str(saved_count) + " of " + str(len(chunks)) + " chunks were saved."
            }

        return {
            "status": "success",
            "chunks_created": len(chunks)
        }

    except Exception as error:
        return {
            "status": "failed",
            "error": str(error)
        }


# This defines the shape of data we expect for a question
from typing import List, Optional

class QueryRequest(BaseModel):
    question: str
    document_ids: Optional[List[str]] = None

class DeleteRequest(BaseModel):
    document_id: str


@app.post("/ai/delete")
def delete_document(request: DeleteRequest):
    try:
        delete_chunks_by_document(request.document_id)
        return {"status": "success"}

    except Exception as error:
        return {
            "status": "failed",
            "error": str(error)
        }

# This endpoint takes a question and returns a grounded answer with sources
@app.post("/ai/query")
def query_documents(request: QueryRequest):
    try:
        # "or []" makes the default SAFE: if Node forgets to send document_ids,
        # we treat it as "no documents" instead of "search every document"
        result = answer_question(request.question, document_ids=request.document_ids or [])

        return {
            "status": "success",
            "answer": result["answer"],
            "source_pages": result["source_pages"],
            "source_snippets": result["source_snippets"]
        }

    except Exception as error:
        return {
            "status": "failed",
            "error": str(error)
        }