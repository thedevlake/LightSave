import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes/router"; // your router config

function App() {
  return <RouterProvider router={router} />;
}

export default App;
