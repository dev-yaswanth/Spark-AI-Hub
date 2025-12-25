try:
    from langchain_community.agents import initialize_agent
    print("initialize_agent found in langchain_community")
except ImportError:
    print("initialize_agent NOT found in langchain_community")
