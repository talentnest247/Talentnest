"use client"

// Simple toast notification component without external dependencies
export function Toaster() {
  return (
    <div
      className={`fixed top-4 right-4 z-50 text-blue-600`}
      id="toast-container"
    />
  )
}

// Simple toast function
export function toast(message: string, type: "success" | "error" | "info" = "info") {
  const container = document.getElementById("toast-container")
  if (!container) return

  const toastEl = document.createElement("div")
  toastEl.className = `mb-2 p-3 rounded-md shadow-lg transition-all duration-300 ${
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
  }`
  toastEl.textContent = message

  container.appendChild(toastEl)

  setTimeout(() => {
    toastEl.style.opacity = "0"
    setTimeout(() => {
      container.removeChild(toastEl)
    }, 300)
  }, 3000)
}
