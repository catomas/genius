import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!openai.apiKey)
      return new NextResponse("OpenAI API Key not found", { status: 500 });

    if (!prompt) return new NextResponse("Prompt not found", { status: 400 });

    if (!amount) return new NextResponse("Amount not found", { status: 400 });

    if (!resolution)
      return new NextResponse("Resolution not found", { status: 400 });

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial limit exceeded", { status: 403 });
    }

    const response = await openai.images.generate({
      prompt: prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[IMAGE ROUTE ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
