# This file connects to Groq (a free, cloud-hosted LLM service)
# It sends a prompt and gets back a text answer

import os
from dotenv import load_dotenv
from groq import Groq

# Load the API key from our .env file
load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Change this if you want to try a different Groq-hosted model
MODEL_NAME = "openai/gpt-oss-20b"
print("Using model:", MODEL_NAME) 


# This function sends a simple prompt to the LLM and returns its answer
def ask_llm(prompt):
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )

    answer_text = response.choices[0].message.content
    return answer_text


# This function builds a strict prompt using retrieved chunks,
# so the LLM only answers from those chunks and does not make things up
def ask_llm_with_context(question, context_chunks):
    context_text = ""
    for i in range(len(context_chunks)):
        chunk_text = context_chunks[i]
        context_text = context_text + "Chunk " + str(i + 1) + ":\n" + chunk_text + "\n\n"

    prompt = """You are a helpful assistant that answers questions using ONLY the context provided below.

Rules:
- Only use information found in the context below to answer.
- If the answer is not in the context, say "I don't know based on the given documents."
- Do not make up any information that is not in the context.

Context:
""" + context_text + """

Question: """ + question + """

Answer:"""

    answer = ask_llm(prompt)
    return answer


# This part only runs when we test this file directly
if __name__ == "__main__":
    test_prompt = "Say hello in one short sentence."

    print("Sending test prompt to Groq...")
    answer = ask_llm(test_prompt)

    print("Model replied:")
    print(answer)