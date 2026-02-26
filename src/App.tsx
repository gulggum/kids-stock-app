import { useState, useEffect } from "react";
import { Providers } from "./providers";
import { AppRouter } from "./router/router";
import SplashScreen from "./pages/LoadingPage/SplashScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2초 후 사라짐

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Providers>{isLoading ? <SplashScreen /> : <AppRouter />}</Providers>
    </>
  );
}

export default App;
