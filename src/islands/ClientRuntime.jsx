import { useEffect } from "preact/hooks";

export default function ClientRuntime() {
  useEffect(() => {
    document.documentElement.classList.add("has-islands");
  }, []);

  return null;
}
