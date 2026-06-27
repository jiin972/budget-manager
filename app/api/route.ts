export default async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const response = await fetch("http://100.109.28.107:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma4:e4b",
        prompt: prompt,
        stream: false,
      }),
    });
    const data = await response.json();
    return Response.json({ result: data.response });
  } catch (error) {
    const e = error as Error;
    return Response.json({ err: e.message }, { status: 500 });
  }
}
