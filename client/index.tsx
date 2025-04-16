import { hc } from "hono/client";
import { useState } from "hono/jsx";
import { render } from "hono/jsx/dom";
import type { AppType } from "../types.ts";
import './app.css'
import { Button } from "@/components/ui/button.tsx"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx"

const client = hc<AppType>("/");

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-rose-100 to-teal-100" >
    <Card className="mx-auto max-w-sm">
        <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
                Enter your information to create an account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <h1>Hello hono/jsx/dom!</h1>
          <h2>Example of useState()</h2>
          <Counter />
          <h2>Example of API fetch()</h2>
          <ClockButton />
        </CardContent>
    </Card>
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <Button onClick={() => setCount(count + 1)}>
      You clicked me {count} time
    </Button>
  );
}

const ClockButton = () => {
  const [response, setResponse] = useState<string | null>(null);

  const handleClick = async () => {
    const response = await client.api.clock.$get();
    const data = await response.json();
    const headers = Array.from(response.headers.entries()).reduce<
      Record<string, string>
    >((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
    const fullResponse = {
      url: response.url,
      status: response.status,
      headers,
      body: data,
    };
    setResponse(JSON.stringify(fullResponse, null, 2));
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Get Server Time
      </button>
      {response && <pre>{response}</pre>}
    </div>
  );
};

const root = document.getElementById("root")!;
render(<App />, root);
