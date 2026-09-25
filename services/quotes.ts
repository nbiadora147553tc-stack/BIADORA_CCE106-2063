export type Quote = {
  text: string;
  author: string;
};

type DummyJsonQuote = {
  quote?: unknown;
  author?: unknown;
};

const QUOTE_API_URL = "https://dummyjson.com/quotes/random";

// Fetch and validate a random quote before returning it to the screen.
export async function getRandomQuote(): Promise<Quote> {
  const response = await fetch(QUOTE_API_URL);

  if (!response.ok) {
    throw new Error(`Quote request failed (${response.status})`);
  }

  const data = (await response.json()) as DummyJsonQuote;

  if (typeof data.quote !== "string" || typeof data.author !== "string") {
    throw new Error("The quote response was incomplete.");
  }

  return { text: data.quote, author: data.author };
}
