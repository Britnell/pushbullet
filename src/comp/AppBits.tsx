import type { FormEvent } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "react-query";

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

function AppBits() {
  const query = useQuery<Bits[], string>("bits", fetchUserBits, {
    // staleTime: Infinity,
    // cacheTime: Infinity,
    initialData: () => {
      const local = loadFromLocalStorage();
      console.log({ local });
      return local ?? [];
    },
    onSuccess: (data) => {
      saveToLocalStorage(data);
    },
  });

  const create = useMutation({
    mutationKey: "create",
    mutationFn: fetchCreateBit,
    onSuccess: (_, data) => {
      const prev = queryClient.getQueryData<Bits[]>("bits");
      const newBit = {
        text: data,
        date: new Date().toISOString().replace("T", " ").slice(0, -5),
      };
      queryClient.setQueryData("bits", () => [...(prev ?? []), newBit]);
    },
  });

  const submit = (ev: FormEvent) => {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;
    const text = form.text.value;
    if (text === "") return;

    console.log({ text });
    create.mutate(text);
  };

  console.log(query);

  return (
    <div>
      <h2>Your Bits</h2>
      {query.data && (
        <ul>
          {query.data.map((bit, b) => (
            <li key={b}>
              {bit.text} - <span className=" ">{bit.date}</span>
            </li>
          ))}
        </ul>
      )}
      {query.error && (
        <div>
          <p>ERROR - {query.error}</p>
        </div>
      )}
      {/* <NewBit /> */}
      <form onSubmit={submit}>
        <textarea name="text" rows={3} />
        <button>Submit</button>
      </form>
    </div>
  );
}

const fetchUserBits = () =>
  fetch("/api/bits/user").then(async (res) => {
    if (res.ok) return res.json();
    throw new Error(await res.text());
  });

const fetchCreateBit = (text: string) =>
  fetch("/api/bits/new", {
    method: "POST",
    body: text,
  }).then(async (res) => {
    if (res.ok) return res.text();
    throw new Error(await res.text());
  });

const localKey = "pushbullet-cache";

const loadFromLocalStorage = () => {
  if (typeof window === "undefined") return null;
  const str = localStorage.getItem(localKey);
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

const saveToLocalStorage = (data: object | null) => {
  if (typeof window === "undefined") return null;
  if (data === null) {
    localStorage.removeItem(localKey);
    return;
  }
  localStorage.setItem(localKey, JSON.stringify(data));
};
