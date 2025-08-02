import google.generativeai as genai

ad_agency_agent = genai.create_agent(
    name="ad_agency_agent",
    model="gemini-2.0-flash",
    description="Main agent for the Ad Agency AI Assistant.",
    instruction="You are a helpful AI assistant that specializes in generating ad campaigns and copy.",
    tools=[]
)