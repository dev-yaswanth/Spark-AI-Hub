try:
    from langchain.agents import create_react_agent
    print("create_react_agent found in langchain.agents")
except ImportError:
    print("create_react_agent NOT found in langchain.agents")

try:
    from langchain.agents import AgentExecutor
    print("AgentExecutor found")
except ImportError:
    print("AgentExecutor NOT found")
