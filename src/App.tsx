import { useEffect, useState } from "react";
import { Providers } from "./providers";
import { AppRouter } from "./router/router";
import IntroBackground from "./pages/LoadingPage/IntroBackground";
import { createGlobalStyle } from "styled-components";

const BaseGlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

`;

type Step = "video" | "logo" | "app";
function App() {
  const [step, setStep] = useState<Step>(() => {
    const hasLoaded = sessionStorage.getItem("hasLoaded");
    return hasLoaded ? "app" : "video";
  });

  useEffect(() => {
    if (step !== "video") return;

    const videoTimer = setTimeout(() => {
      setStep("logo");
    }, 3000);

    const logoTimer = setTimeout(() => {
      setStep("app");
      sessionStorage.setItem("hasLoaded", "true"); // 🔥 여기로 이동
    }, 3000); // 👉 3초 + 3초

    return () => {
      clearTimeout(videoTimer);
      clearTimeout(logoTimer);
    };
  }, [step]);
  return (
    <Providers>
      <BaseGlobalStyle />
      {step === "video" && <IntroBackground />}
      {step === "app" && <AppRouter />}
    </Providers>
  );
}

export default App;
