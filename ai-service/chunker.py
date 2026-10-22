# This function takes one page's text and breaks it into
# smaller pieces (chunks), so it is easier to search later

def split_into_chunks(text, chunk_size=150, overlap=30):
    # First, split the whole text into a list of words
    words = text.split()

    # This list will store all our chunks
    chunks = []

    # This tells us where to start the next chunk
    start = 0

    # Keep making chunks until we reach the end of the words
    while start < len(words):
        # Take a group of words, from start to start + chunk_size
        end = start + chunk_size
        chunk_words = words[start:end]

        # Join the words back into a normal sentence
        chunk_text = " ".join(chunk_words)

        chunks.append(chunk_text)

        # Move the start forward, but go back a little bit (overlap)
        # so we don't lose meaning between chunks
        start = start + chunk_size - overlap

    return chunks


# This part only runs when we test this file directly
if __name__ == "__main__":
    sample_text = """
    This is just a test paragraph to check if our chunking function works properly.
    We are pretending this is a big page of text from a PDF file.
    The function should split this into smaller pieces based on word count.
    """

    result = split_into_chunks(sample_text, chunk_size=10, overlap=3)

    for index, chunk in enumerate(result):
        print("---- Chunk", index + 1, "----")
        print(chunk)