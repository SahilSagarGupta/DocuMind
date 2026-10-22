import fitz  # this is the pymupdf library

# This function takes a PDF file path and returns
# the text from every page, along with the page number
def read_pdf(file_path):
    # Open the PDF file
    pdf_document = fitz.open(file_path)

    # This list will store text from each page
    pages_text = []

    # Go through each page one by one
    for page_number in range(len(pdf_document)):
        page = pdf_document[page_number]
        text = page.get_text()

        # Save the page number and its text together
        pages_text.append({
            "page_number": page_number + 1,
            "text": text
        })

    pdf_document.close()

    return pages_text


# This part only runs when we run this file directly
# It is just for testing, so we can see if reading works
if __name__ == "__main__":
    result = read_pdf("test_documents/sample.pdf")

    for page in result:
        print("---- Page", page["page_number"], "----")
        print(page["text"])