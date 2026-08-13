import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city) {
    return NextResponse.json(
      { error: "A city query parameter is required." },
      { status: 400 },
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather API key is not configured." },
      { status: 500 },
    );
  }

  const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
  weatherUrl.searchParams.set("q", city);
  weatherUrl.searchParams.set("appid", apiKey);
  weatherUrl.searchParams.set("units", "imperial");

  try {
    const weatherResponse = await fetch(weatherUrl, {
      cache: "no-store",
    });
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      return NextResponse.json(
        { error: "Unable to fetch weather.", details: weatherData },
        { status: weatherResponse.status },
      );
    }

    return NextResponse.json(weatherData);
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch weather." },
      { status: 500 },
    );
  }
}
