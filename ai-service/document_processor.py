# This file combines pdf_reader.py and chunker.py
# It reads a PDF and turns it into a list of chunks,
# where every chunk remembers which page AND which document it came from

from pdf_reader import read_pdf
from chunker import split_into_chunks


# This function takes a PDF file path and returns
# a list of chunks, each with its page number, document id, and a unique id
def process_document(file_path):
    # Step 1: read all the pages from the PDF
    pages = read_pdf(file_path)

    # This list will store every chunk from every page
    all_chunks = []

    # A counter to give each chunk a unique number
    chunk_number = 1

    # Step 2: go through each page one by one
    for page in pages:
        page_number = page["page_number"]
        page_text = page["text"]

        # Step 3: split this page's text into smaller chunks
        page_chunks = split_into_chunks(page_text)

        # Step 4: save each chunk along with its page number and source document
        for chunk_text in page_chunks:
            all_chunks.append({
                "chunk_id": chunk_number,
                "page_number": page_number,
                "text": chunk_text,
                "document_id": file_path
            })
            chunk_number = chunk_number + 1

    return all_chunks


# This part only runs when we test this file directly
if __name__ == "__main__":
    chunks = process_document("test_documents/sample.pdf")

    print("Total chunks created:", len(chunks))
    print()

    for chunk in chunks[:3]:
        print("---- Chunk", chunk["chunk_id"], "(Page", chunk["page_number"], ") ----")
        print("Document:", chunk["document_id"])
        print(chunk["text"])
        print()