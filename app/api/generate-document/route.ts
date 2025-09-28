import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages, maxTokens = 2000, documentType } = await request.json()

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || !apiKey.startsWith("sk-")) {
      return NextResponse.json(
        {
          error: "OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.",
        },
        { status: 500 },
      )
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenAI API error:", response.status, errorData)

      let errorMessage = "OpenAI API error occurred"
      if (response.status === 401) {
        errorMessage = "Invalid OpenAI API key. Please check your configuration."
      } else if (response.status === 429) {
        errorMessage = "OpenAI API rate limit exceeded. Please try again later."
      } else if (response.status === 402) {
        errorMessage = "Insufficient OpenAI credits. Please check your account balance."
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ""

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Document generation error:", error)
    return NextResponse.json({ error: "Internal server error during document generation" }, { status: 500 })
  }
}
