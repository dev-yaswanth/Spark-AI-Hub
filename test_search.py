import os
from dotenv import load_dotenv
from langchain_community.tools import DuckDuckGoSearchRun
load_dotenv()
try:
    search = DuckDuckGoSearchRun()
    print(f"SEARCH_RESULT: {search.run('what is the time in Vijayawada right now?')}")
except Exception as e:
    print(f"SEARCH_ERROR: {str(e)}")
