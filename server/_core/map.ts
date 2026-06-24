// Maps integration is not used in this project
export async function makeRequest<T = unknown>(_endpoint: string, _params?: Record<string, unknown>): Promise<T> {
  throw new Error("Maps integration is not available");
}
