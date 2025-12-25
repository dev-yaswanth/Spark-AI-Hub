from langchain import hub
try:
    prompt = hub.pull("hwchase17/react-chat")
    print(f"Prompt input variables: {prompt.input_variables}")
except Exception as e:
    print(f"Error checking prompt: {e}")
