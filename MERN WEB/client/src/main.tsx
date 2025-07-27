import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import router from "./router.tsx"
import { AuthProvider } from "./context/AuthProvider.tsx"
import { Toaster } from "react-hot-toast"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <AuthProvider>
          <RouterProvider router={router} />
<Toaster
  position="top-center"
  toastOptions={{
    duration: 4000,
    style: {
      fontSize: "1.1rem",
      padding: "16px 24px",
      minWidth: "300px",
      textAlign: "center",
      borderRadius: "12px",
    },
    loading: {
      style: {
        fontSize: "1.2rem",
        color: "#4a90e2",
      },
      iconTheme: {
        primary: "#4a90e2",
        secondary: "#f0f0f0",
      }
    },
  }}
/>
      </AuthProvider>
  </StrictMode>
)
