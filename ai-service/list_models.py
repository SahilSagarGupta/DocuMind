# This is a one-time script to check which models our API key can actually use

import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

models = client.models.list()

for model in models.data:
    print(model.id)