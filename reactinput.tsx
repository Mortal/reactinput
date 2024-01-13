import { useState } from 'react'

const TextInput = (props: {value: string, isValid?: (v: string) => boolean, onChange: (v: string) => void}) => {
  const [input, setInput] = useState<string|null>(null);
  const valid = props.isValid == null || input == null ? true : props.isValid(input);
  return <input
    style={{border: valid ? "1px solid black" : "1px solid red", flex: "1 0 0"}}
    onFocus={() => setInput(props.value)}
    onBlur={() => {
      if (valid && input != null) props.onChange(input);
      setInput(null);
    }}
    value={input ?? props.value}
    onChange={(e) => void setInput(e.target.value)}
  />
}

const NullNumberInput = (props: {value: number | null, isValid?: (v: number | null) => boolean, onChange: (v: number | null) => void}) => {
  const fold = <T,>(good: (v: number | null) => T, bad: () => T) => (s: string) => {
    if (s === "") return good(null);
    const n = +s;
    return isNaN(n) ? bad() : good(n);
  };
  return <TextInput
    value={props.value == null ? "" : `${props.value}`}
    isValid={fold((v) => props.isValid == null || props.isValid(v), () => false)}
    onChange={fold(props.onChange, () => void 0)}
    />;
}

const NumberInput = (props: {value: number, isValid?: (v: number) => boolean, onChange: (v: number) => void}) => {
  const fold = <T,>(good: (v: number) => T, bad: () => T) => (s: string) => {
    const n = +s;
    return isNaN(n) ? bad() : good(n);
  };
  return <TextInput
    value={`${props.value}`}
    isValid={fold((v) => props.isValid == null || props.isValid(v), () => false)}
    onChange={fold(props.onChange, () => void 0)}
    />;
}

function App() {
  const [a,setA] = useState(5);
  const [b,setB] = useState(7);
  const reconstruct = (v: number) => {
    const b = Math.round(v / a);
    return [a, b];
  }

  return (
    <div style={{width: "100%", display: "flex", flexDirection:"column", gap: "8px", alignItems: "center"}}>
      <NumberInput value={a} onChange={setA} />
      <NumberInput value={b} onChange={setB} />
      <NumberInput value={a*b} isValid={(v) => reconstruct(v) != null} onChange={(v) => {
        const s = reconstruct(v);
        if (s != null) {
          setA(s[0]);
          setB(s[1]);
        }
      }} />
    </div>
  )
}

export default App
