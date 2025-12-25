try:
    from langchain.agents import initialize_agent
    print("Import successful")
except ImportError as e:
    print(f"Import failed: {e}")

import langchain
print(f"LangChain version: {langchain.__version__}")

try:
    import langchain_community
    print(f"LangChain Community version: {langchain_community.__version__}")
except ImportError:
    print("LangChain Community not installed")
