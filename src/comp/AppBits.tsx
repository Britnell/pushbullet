import { useRef, type FormEvent, useLayoutEffect, Fragment } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const query = useQuery<Bits[], string>("bits", fetchUserBits, {
    // staleTime: Infinity,
    // cacheTime: Infinity,
    initialData: () => {
      const local = loadFromLocalStorage();
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
    create.mutate(text);
  };

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);
  let lastDate = "";

  return (
    <div className=" h-[calc(100dvh-64px)] flex flex-col ">
      <h2>Your Bits</h2>
      <div ref={scrollRef} className=" grow  overflow-auto">
        {query.data && (
          <ul className=" flex flex-col ">
            {query.data.map((bit, b) => {
              // only render new dates
              const date = bit.date.split(" ")[0];
              const showDate = date !== lastDate;
              lastDate = date;
              return (
                <Fragment key={b}>
                  {showDate && (
                    <p className="  mt-10 mb-6 text-gray-500 text-center  border-b-2 border-gray-300 pb-2">
                      {date}
                    </p>
                  )}
                  <li className=" mb-6 bg-blue-200 p-2 px-10 rounded-xl w-fit">
                    {bit.text}
                  </li>
                </Fragment>
              );
            })}
          </ul>
        )}
        {query.error && (
          <div>
            <p>ERROR - {query.error}</p>
          </div>
        )}
      </div>
      <form
        onSubmit={submit}
        className=" p-1 flex flex-wrap items-start gap-3 shadow-[0px_0px_10px_rgba(0,0,0,0.3)]"
      >
        <textarea
          className="  rounded-sm px-2 py-1 w-full max-w-[600px]"
          name="text"
          rows={3}
          placeholder="Your new Bit..."
        />
        <button className=" bg-blue-200 rounded-full px-4 py-1">Submit</button>
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
