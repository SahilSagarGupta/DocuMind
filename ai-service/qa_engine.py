# This file combines retrieval + re-ranking + generation + citation tracking
# It is the main "ask a question, get a grounded answer with sources" function

from vector_store import search_chunks
from llm import ask_llm_with_context
from reranker import rerank_chunks
from small_talk import get_small_talk_reply


NO_DOCUMENTS_MESSAGE = (
    "This chat has no processed documents yet. "
    "Click \"Upload document\" in the sidebar, wait until it shows \"Ready\", "
    "and then ask your question. Documents belong to the chat they were uploaded in."
)


# This function builds a reply that has no sources
def make_reply_without_sources(question, answer_text):
    return {
        "question": question,
        "answer": answer_text,
        "source_pages": [],
        "source_snippets": []
    }


# This function checks if the model said "I don't know".
# In that case the answer has no real source, so we must not show citations.
def is_refusal(answer_text):
    text = answer_text.lower().replace("\u2019", "'")
    return "know based on the given documents" in text


def answer_question(question, number_of_results=3, document_ids=None):
    # Step 0: small talk (hello, thanks, "what can you do") needs no documents
    small_talk_reply = get_small_talk_reply(question)
    if small_talk_reply is not None:
        return make_reply_without_sources(question, small_talk_reply)

    # Step 1: if this chat has no documents, there is nothing to search
    if document_ids is not None and len(document_ids) == 0:
        return make_reply_without_sources(question, NO_DOCUMENTS_MESSAGE)

    # Step 2: retrieve candidate chunks, only from the allowed documents
    results = search_chunks(question, number_of_results=5, document_ids=document_ids)

    retrieved_texts = results["documents"][0]
    retrieved_metadata = results["metadatas"][0]

    if len(retrieved_texts) == 0:
        return make_reply_without_sources(question, NO_DOCUMENTS_MESSAGE)

    # Step 3: re-rank and keep the best few
    ranked_chunks = rerank_chunks(question, retrieved_texts, retrieved_metadata)
    top_chunks = ranked_chunks[:number_of_results]

    final_texts = []
    source_pages = []
    source_snippets = []

    for item in top_chunks:
        final_texts.append(item["text"])

        page_number = item["metadata"]["page_number"]

        if page_number not in source_pages:
            source_pages.append(page_number)
            source_snippets.append({
                "page_number": page_number,
                "text": item["text"]
            })

    # Step 4: generate the grounded answer
    answer_text = ask_llm_with_context(question, final_texts)

    # Step 5: if the model said "I don't know", remove the citations
    if is_refusal(answer_text):
        source_pages = []
        source_snippets = []

    return {
        "question": question,
        "answer": answer_text,
        "source_pages": source_pages,
        "source_snippets": source_snippets
    }


if __name__ == "__main__":
    question = "What does the company do for health and safety?"

    # None here means "search everything". This is only for testing from the terminal.
    result = answer_question(question)

    print("Answer:")
    print(result["answer"])
    print()
    print("Sources: Page(s)", result["source_pages"])