# This file re-scores retrieved chunks to put the most relevant one first
# It uses a cross-encoder, which compares the question and chunk together
# for a more accurate relevance score than plain vector similarity

from sentence_transformers import CrossEncoder

# Load the cross-encoder model once when this file is imported
reranker_model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")


# This function takes a question and a list of chunk texts,
# and returns them sorted from most relevant to least relevant
def rerank_chunks(question, chunk_texts, chunk_metadata):
    # Build pairs of (question, chunk_text) for the model to score
    pairs = []
    for chunk_text in chunk_texts:
        pairs.append([question, chunk_text])

    # Get a relevance score for each pair
    scores = reranker_model.predict(pairs)

    # Combine each chunk with its score and metadata, so we can sort them together
    combined = []
    for i in range(len(chunk_texts)):
        combined.append({
            "text": chunk_texts[i],
            "metadata": chunk_metadata[i],
            "score": scores[i]
        })

    # Sort by score, highest (most relevant) first
    combined_sorted = sorted(combined, key=lambda item: item["score"], reverse=True)

    return combined_sorted


# This part only runs when we test this file directly
if __name__ == "__main__":
    question = "What does the company do for health and safety?"

    sample_chunks = [
        "The company focuses on quality management and customer satisfaction.",
        "We are committed to health and safety, using the STOP principle to protect workers.",
        "Information security protects our business processes and IT systems."
    ]

    sample_metadata = [
        {"page_number": 3},
        {"page_number": 2},
        {"page_number": 3}
    ]

    ranked = rerank_chunks(question, sample_chunks, sample_metadata)

    for item in ranked:
        print("Score:", item["score"], "| Page:", item["metadata"]["page_number"])
        print(item["text"])
        print()