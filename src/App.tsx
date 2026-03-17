import { useEffect, useState } from "react";
import { Providers } from "./providers";
import { AppRouter } from "./router/router";
import LoadingScreen from "./pages/LoadingPage/LoadingScreen";

type Step = "video" | "logo" | "app";
function App() {
  const [step, setStep] = useState<Step>("video");

  useEffect(() => {
    const videoTimer = setTimeout(() => {
      setStep("logo");
    }, 3000);

    const logoTimer = setTimeout(() => {
      setStep("app");
    }, 3000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(videoTimer);
    };
  }, []);

  return (
    <Providers>
      {step === "video" && <LoadingScreen />}
      {/* {step === "logo" && <SplashScreen />} */}
      {step === "app" && <AppRouter />}
    </Providers>
  );
}

export default App;
