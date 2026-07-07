// lib/nomba-error.ts
export const handleNombaError = (err: any) => {
  const nombaError = err.response?.data
  if (nombaError?.code) {
    console.error("Nomba error", nombaError)
    return {
      status: err.response.status || 400,
      success: false,
      message: nombaError.description || nombaError.message || "Nomba request failed",
      code: nombaError.code
    }
  }
  return { status: 500, success: false, message: "Internal server error" }
}