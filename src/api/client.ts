import { ApiError } from "./types"

const BASE_URL =
  (import.meta as unknown as { env: Record<string, string> }).env
    .VITE_API_BASE_URL ?? "http://localhost:8000/api"

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // TODO: Add Authorization header when auth is implemented
  }

  let response: Response

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    })
  } catch {
    throw new ApiError(
      0,
      "Unable to connect to the server. Please check your connection and try again.",
    )
  }

  if (!response.ok) {
    let body: unknown
    let message: string

    try {
      body = await response.json()
      message =
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof (body as { message: unknown }).message === "string"
          ? (body as { message: string }).message
          : `Request failed with status ${response.status}`
    } catch {
      message = `Request failed with status ${response.status}`
    }

    throw new ApiError(response.status, message, body)
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as T
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError(
      response.status,
      "Received an invalid response from the server.",
    )
  }
}

export async function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" })
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export async function put<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export async function patch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export async function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" })
}
