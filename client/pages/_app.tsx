import type { AppProps } from "next/app";
import "./globalStyles.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
