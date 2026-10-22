# This file turns text into embeddings (numbers that represent meaning)
# We use a small, free, pre-trained model called all-MiniLM-L6-v2

from sentence_transformers import SentenceTransformer

# Load the model one time when this file is imported
# This might take a few seconds the first time (it downloads the model)
model = SentenceTransformer("all-MiniLM-L6-v2")


# This function takes one piece of text and returns its embedding
def get_embedding(text):
    embedding = model.encode(text)
    return embedding


# This part only runs when we test this file directly
if __name__ == "__main__":
    sample_text = "The school district will provide sick leave benefits to all employees."

    result = get_embedding(sample_text)

    print("Embedding length:", len(result))
    print("First 5 numbers:", result[:5])