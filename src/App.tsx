import { useEffect, useState } from "react";
import { Providers } from "./providers";
import { AppRouter } from "./router/router";
import SplashScreen from "./pages/LoadingPage/SplashScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Providers> {isLoading ? <SplashScreen /> : <AppRouter />}</Providers>
    </>
  );
}

export default App;
