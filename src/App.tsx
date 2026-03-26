import { useEffect, useState } from "react";
import { Providers } from "./providers";
import { AppRouter } from "./router/router";
import LoadingScreen from "./pages/LoadingPage/LoadingScreen";
import { createGlobalStyle } from "styled-components";
import { playIntroSound } from "./utils/sounds";

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

    // ✅ 여기에 추가 - 비디오 시작할 때 사운드 같이 재생
    playIntroSound();

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
      {step === "video" && <LoadingScreen />}
      {step === "app" && <AppRouter />}
    </Providers>
  );
}

export default App;
