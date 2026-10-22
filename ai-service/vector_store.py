# This file saves our chunks and their embeddings into ChromaDB
# so we can search them later by meaning, and delete them by document
import uuid
import chromadb
from embedder import get_embedding


client = chromadb.PersistentClient(path="chroma_data")
collection = client.get_or_create_collection(name="documind_chunks")


# This function takes a list of chunks (from document_processor.py)
# and saves them into ChromaDB, one by one
def save_chunks_to_db(chunks):
    for chunk in chunks:
        embedding = get_embedding(chunk["text"])

        chunk_id_string = str(uuid.uuid4())

        collection.add(
            ids=[chunk_id_string],
            embeddings=[embedding.tolist()],
            documents=[chunk["text"]],
            metadatas=[{
                "page_number": chunk["page_number"],
                "document_id": chunk["document_id"]
            }]
        )

    print("Saved", len(chunks), "chunks to the database.")


# This function takes a question and finds the most relevant
# chunks stored in the database
# document_ids is optional - if given, search only within those documents
# This prevents one document's chunks from leaking into another document's answers
# document_ids is the list of documents we are ALLOWED to search.
# If a list is given (even an empty one), we search ONLY inside it.
# An empty list means "this chat has no documents", so there is nothing to search.
def search_chunks(question, number_of_results=3, document_ids=None):
    if document_ids is not None and len(document_ids) == 0:
        return {"documents": [[]], "metadatas": [[]]}

    question_embedding = get_embedding(question)

    query_filter = None
    if document_ids is not None:
        query_filter = {"document_id": {"$in": document_ids}}

    results = collection.query(
        query_embeddings=[question_embedding.tolist()],
        n_results=number_of_results,
        where=query_filter
    )

    return results


# This function deletes all chunks belonging to one document from ChromaDB
def delete_chunks_by_document(document_id):
    collection.delete(
        where={"document_id": document_id}
    )
    print("Deleted all chunks for document:", document_id)

# This function counts how many chunks are really stored for one document
def count_chunks_for_document(document_id):
    saved = collection.get(
        where={"document_id": document_id},
        include=["metadatas"]
    )
    return len(saved["ids"])

# This part only runs when we test this file directly
if __name__ == "__main__":
    from document_processor import process_document

    if collection.count() == 0:
        chunks = process_document("test_documents/sample.pdf")
        save_chunks_to_db(chunks)

    print("Total items in collection:", collection.count())