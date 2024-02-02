import {
  useQuery,
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "react-query";
import type { Bits } from "./db";

const queryClient = new QueryClient();

export const QueryProvidor = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export const useBits = () =>
  useQuery<Bits[], string>({
    queryKey: "bits",
    queryFn: () =>
      fetch("/api/bits/user").then(async (res) => {
        if (res.ok) return res.json();
        throw new Error(await res.text());
      }),
    initialData: () => {
      const local = loadFromLocalStorage();
      return local ?? [];
    },
    onSuccess: (data) => {
      saveToLocalStorage(data);
    },
  });

export const useCreator = () =>
  useMutation({
    mutationKey: "create",
    mutationFn: (text: string) =>
      fetch("/api/bits/new", {
        method: "POST",
        body: text,
      }).then(async (res) => {
        if (res.ok) return res.json();
        throw new Error(await res.text());
      }),
    onSuccess: (resp) => {
      const prev = queryClient.getQueryData<Bits[]>("bits") ?? [];
      queryClient.setQueryData("bits", () => [...prev, resp]);
    },
  });

export const useDeletor = () =>
  useMutation({
    mutationKey: "delete",
    mutationFn: (bitid: string | number) =>
      fetch("/api/bits/delete", {
        method: "POST",
        body: bitid.toString(),
      }).then(async (res) => {
        if (res.ok) return res.text();
        throw new Error(await res.text());
      }),
    onSuccess: (_, data) => {
      const prev = queryClient.getQueryData<Bits[]>("bits") ?? [];
      const without = prev.filter((bit) => bit.id !== data);
      queryClient.setQueryData("bits", () => without);
    },
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
