// A source file as text (Vite's ?raw import): the screens' code is checked by the tests where no DOM runs.
declare module '*?raw' {
  const text: string;
  export default text;
}
