// Full server code for OpenAI Nim Proxy

import http
import json

const API_URL = "https://api.openai.com/v1/engines/davinci/completions"

# Function to call OpenAI API
proc callOpenAI(prompt: string): string =
    let client = new HttpClient()
    let headers = new HttpHeaders()
    headers.add("Authorization", "Bearer YOUR_API_KEY")
    headers.add("Content-Type", "application/json")
    let body = %*{"prompt": prompt, "max_tokens": 150}
    let response = client.postJson(API_URL, body, headers)
   
    if response.status == HttpStatus.ok:
        let jsonResponse = response.body.parseJson()
        return jsonResponse["choices"][0]["text"].getStr()
    else:
        return "Error: " & response.status.toString()

# Main function to run the server
proc main() =
    let server = new HttpServer(8080)
    echo "Server is running on port 8080..."
    while true:
        let req = server.accept()
        let prompt = req.question.getStr()
        let completion = callOpenAI(prompt)
        req.respond(HttpStatus.ok, completion)

# Run the main function
main()