# Imports
import os
import requests
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.environ["GOOGLE_API_KEY"]


def text_search(params, headers):
    # print(params)
    text_search_url = "https://places.googleapis.com/v1/places:searchText"
    response = requests.post(url=text_search_url, json=params, headers=headers).json()

    return response 


