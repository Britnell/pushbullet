import { useRef, useLayoutEffect, Fragment, useState } from "react";
import { QueryProvidor, useBits, useCreator, useDeletor } from "../lib/query";

export default function Wrapper() {
  return (
    <QueryProvidor>
      <AppBits />
    </QueryProvidor>
  );
}

function AppBits() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const query = useBits();
  const creator = useCreator();
  const deletor = useDeletor();

  const submit = () => {
    if (input === "") return;
    creator.mutate(input);
    setInput("");
  };

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);
  let lastDate = "";

  return (
    <div className=" h-[calc(100dvh-48px)] flex flex-col ">
      <div ref={scrollRef} className=" grow  overflow-auto">
        {query.data && (
          <ul>
            {query.data.map((bit, b) => {
              // only render new dates
              const date = bit.date.split(" ")[0];
              const showDate = date !== lastDate;
              lastDate = date;
              return (
                <Fragment key={b}>
                  {showDate && (
                    <p className="  mt-10 mb-4 text-gray-500 text-center  border-b-2 border-gray-300 pb-2">
                      {date}
                    </p>
                  )}
                  <div className="mb-4 group flex items-center  ">
                    <li className="  bg-blue-200 p-2 pl-6 pr-6 rounded-xl w-fit">
                      {bit.text}{" "}
                      <span className=" ml-6 text-[0.7em]">
                        {bit.date.slice(-8)}
                      </span>
                    </li>
                    <button
                      className=" ml-6  bg-slate-100 hidden group-hover:block w-8 h-8 rounded-full "
                      onClick={() => deletor.mutate(bit.id)}
                    >
                      x
                    </button>
                  </div>
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
        onSubmit={(ev) => {
          ev.preventDefault();
          submit();
        }}
      >
        <div className="shadowclip p-1 flex flex-wrap items-start gap-3 shadow-[0px_0px_10px_rgba(0,0,0,0.3)] clip">
          <textarea
            className="  rounded-sm px-2 py-1 w-full max-w-[600px]"
            name="text"
            rows={3}
            placeholder="Your new Bit..."
            value={input}
            onChange={(ev) => setInput(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.code === "Enter") {
                ev.preventDefault();
                submit();
              }
            }}
          />
          <button className=" bg-blue-200 rounded-full px-4 py-1">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
