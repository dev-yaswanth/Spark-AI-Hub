

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from langchain.tools import tool
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

@tool
def calculations(a: float, b: float) -> str:
    """Useful for performing basic arithmetic operations"""
    return f"The sum of {a} and {b} is {a + b}"

@tool
def say_hello(name: str) -> str:
    """Useful for greeting the Buddy"""
    return f"Hello {name}, how are you?"

@tool
def get_weather(city: str) -> str:
    """Useful for fetching weather in any city"""
    return f"The weather in {city} is sunny and warm!"

def main():
    #Using latest Gemini model
    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    tools =[]
    #tools = [calculations, say_hello,get_weather]
    agent_executor = create_agent(model, tools)

    print("\nHey there! I'm S.P.A.R.K. — your Smart Personal Assistant for Real-time Knowledge.")
    print("---------------------------------------------------")
    print("Ask me anything, or type 'quit' if you’re done chatting.")
    print("---------------------------------------------------")
    print("So, how can I help you today?")

    while True:
        user_input = input('\nBuddy: ').strip()

        if user_input.lower() == 'quit':
            print('\nS.P.A.R.K.: See you later, Buddy. Goodbye!')
            break

        response = agent_executor.invoke({"messages": [HumanMessage(content=user_input)]})

        #Extract and print model reply only
        if "messages" in response:
            for msg in response["messages"]:
                if hasattr(msg, "content"):
                    print(f"\nS.P.A.R.K.: {msg.content}")
        else:
            print(f"\nS.P.A.R.K.: {response}")

if __name__ == "__main__":
    main()