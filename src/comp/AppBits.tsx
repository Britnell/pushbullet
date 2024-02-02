export type Bits = {
  text: string;
  date: string;
};

function AppBits({ data = [] }: { data?: Bits[] }) {
  console.log(" APP", data);

  return (
    <div>
      <h2>Your Bits</h2>
      <ul>
        {data.map((bit) => (
          <li>
            {bit.text} - <span class=" ">{bit.date}</span>
          </li>
        ))}
      </ul>
      <NewBit />
    </div>
  );
}

const NewBit = () => {
  const submit = (ev: SubmitEvent) => {
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
        <input name="text" rows={3} />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default AppBits;
