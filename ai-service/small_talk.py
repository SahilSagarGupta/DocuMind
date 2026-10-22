# This file handles small talk: greetings, thanks, goodbyes,
# and questions about the assistant itself.
# These messages do not need a document search, so we answer them directly.

import random
import re


# Phrases we look for. All are written in lowercase, without punctuation.
GREETING_PHRASES = [
    "hi", "hii", "hiii", "hello", "hey", "heya", "hola", "yo", "sup",
    "hey there", "hi there", "hello there", "hi documind", "hello documind",
    "hey documind", "good morning", "good afternoon", "good evening",
    "namaste", "namaskar"
]

HOW_ARE_YOU_PHRASES = [
    "how are you", "how are you doing", "how r u", "how do you do",
    "whats up", "kaise ho", "aap kaise ho", "tum kaise ho", "kya haal hai"
]

THANKS_PHRASES = [
    "thanks", "thank you", "thanks a lot", "thanks for your help",
    "thanks for the help", "thx", "shukriya", "dhanyavad"
]

BYE_PHRASES = [
    "bye", "goodbye", "see you", "see you later", "good night",
    "take care", "alvida"
]

ACK_PHRASES = [
    "ok", "okay", "cool", "nice", "great", "got it", "alright",
    "theek hai", "thik hai", "accha", "acha", "hmm"
]

ABOUT_PHRASES = [
    "what can you do", "what can u do", "what do you do", "what all can you do",
    "what else can you do", "what are you able to do", "what are you capable of",
    "tell me what you can do", "who are you", "who r u", "what are you",
    "what is your name", "whats your name", "tell me about yourself",
    "introduce yourself", "how do you work", "how can you help",
    "can you help me", "what is documind", "what does documind do",
    "what are your features", "what are your limitations",
    "what cant you do", "tum kya kar sakte ho", "aap kya kar sakte ho",
    "tum kya kya kar sakte ho", "kya kar sakte ho", "kya nahi kar sakte",
    "tum kaun ho", "aap kaun ho", "tumhara naam kya hai", "aapka naam kya hai"
]

# These must match the WHOLE message exactly
ABOUT_EXACT = ["help", "help me"]


# Ready-made replies. For some categories we keep 2-3 options
# and pick one at random, so the assistant does not sound like a robot.
GREETING_REPLIES = [
    "Hello! I'm DocuMind. Upload a document and ask me anything about it, and I'll answer with sources you can verify.",
    "Hi there! Ready when you are. Upload a document, then ask me a question about it.",
    "Hey! What would you like to know from your documents today?"
]

HOW_ARE_YOU_REPLIES = [
    "I'm doing well, thanks for asking! What would you like to know from your documents today?",
    "All good here! Ask me anything about the documents you've uploaded."
]

THANKS_REPLIES = [
    "You're welcome! Let me know if you have more questions about your documents.",
    "Happy to help! Ask away whenever you're ready."
]

BYE_REPLIES = [
    "Goodbye! Your chats are saved, so you can pick up where you left off anytime.",
    "See you later! Come back whenever you need to look something up."
]

ACK_REPLIES = [
    "Got it. What would you like to ask next?",
    "Sure! Let me know what else you'd like to find in your documents."
]

ABOUT_REPLY = """I'm DocuMind, an assistant that answers questions from the documents you upload.

What I can do:
- Answer questions using only your uploaded documents
- Show the page and exact source text behind every answer, so you can verify it
- Say "I don't know" when the answer is not in your documents, instead of guessing
- Save your chats so you can continue them later

What I can't do:
- Answer general-knowledge questions or browse the internet
- Read documents you haven't uploaded yet
- Read scanned images (text-based PDFs work best)

To get started, click "Upload document", wait until it is processed, and then ask me anything about it."""


# This function cleans a message: lowercase, no punctuation, no extra spaces
def clean_text(message):
    text = message.lower()
    text = re.sub(r"[^a-z0-9 ]", "", text)
    text = " ".join(text.split())
    return text


# This function checks if a phrase appears in the text AND the message is short.
# The length check stops real questions like "hi what is the leave policy"
# from being treated as small talk.
def contains_phrase(text, phrase):
    padded_text = " " + text + " "
    padded_phrase = " " + phrase + " "

    if padded_phrase not in padded_text:
        return False

    text_word_count = len(text.split())
    phrase_word_count = len(phrase.split())

    return text_word_count <= phrase_word_count + 2


# This function checks the text against a whole list of phrases
def matches_any(text, phrase_list):
    for phrase in phrase_list:
        if contains_phrase(text, phrase):
            return True
    return False


# Main function: returns a reply if the message is small talk, otherwise None
def get_small_talk_reply(message):
    text = clean_text(message)

    if text == "":
        return None

    # The order matters. "hello how are you" should get the how-are-you reply.
    if text in ABOUT_EXACT or matches_any(text, ABOUT_PHRASES):
        return ABOUT_REPLY

    if matches_any(text, HOW_ARE_YOU_PHRASES):
        return random.choice(HOW_ARE_YOU_REPLIES)

    if matches_any(text, THANKS_PHRASES):
        return random.choice(THANKS_REPLIES)

    if matches_any(text, BYE_PHRASES):
        return random.choice(BYE_REPLIES)

    if matches_any(text, GREETING_PHRASES):
        return random.choice(GREETING_REPLIES)

    if matches_any(text, ACK_PHRASES):
        return random.choice(ACK_REPLIES)

    return None


# This part only runs when we test this file directly
if __name__ == "__main__":
    test_messages = [
        "hi",
        "Hello!!",
        "hey there",
        "how are you?",
        "hello how are you",
        "what can you do?",
        "tum kya kar sakte ho",
        "what can you do for me",
        "who are you",
        "thanks a lot",
        "thank you so much",
        "bye",
        "good night",
        "ok",
        "What does the company do for health and safety?",
        "hi what is the leave policy",
        "can you help me find the leave policy",
        "what are the limitations of the policy"
    ]

    for message in test_messages:
        reply = get_small_talk_reply(message)
        if reply is None:
            print(message, "->", "DOCUMENT QUESTION")
        else:
            print(message, "->", "SMALL TALK")