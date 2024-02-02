import type { FormEvent } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function Wrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppBits />
    </QueryClientProvider>
  );
}

export type Bits = {
  text: string;
  date: string;
};

const fetchUserBits = () =>
  fetch("/api/bits/user").then(async (res) =>
    res.ok ? res.json() : { error: await res.text() }
  );

function AppBits() {
  const query = useQuery("bits", fetchUserBits);

  console.log(query);
  return (
    <div>
      <h2>Your Bits</h2>
      <ul>
        {query.data?.map((bit) => (
          <li>
            {bit.text} - <span className=" ">{bit.date}</span>
          </li>
        ))}
      </ul>
      <NewBit />
    </div>
  );
}

const NewBit = () => {
  const submit = (ev: FormEvent) => {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;
    const text = form.text.value;
    if (text === "") return;

    console.log({ text });

    fetch("/api/bits/new", {
      method: "POST",
      body: text,
    })
      .then((resp) => resp.text())
      .then(console.log);
  };

  return (
    <div>
      <form onSubmit={submit}>
        <textarea name="text" rows={3} />
        <button>Submit</button>
      </form>
    </div>
  );
};
