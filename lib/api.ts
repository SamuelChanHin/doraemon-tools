class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

async function handleResponse(res: Response) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (body && body.message) || "API Error";
    const status = (body && body.statusCode) || res.status;
    throw new ApiError(message, status);
  }
  return body;
}

export async function getDoraemonTools(params: any) {
  const qs = new URLSearchParams(params || {}).toString();
  const res = await fetch(`/api/doraemon/tool${qs ? `?${qs}` : ""}`);
  return handleResponse(res);
}

export async function getDoraemonToolByRandom() {
  const res = await fetch("/api/doraemon/tool/random");
  return handleResponse(res);
}

export async function getDoraemonToolCount() {
  const res = await fetch("/api/doraemon/tool/count");
  return handleResponse(res);
}

export async function getDoraemonMovies(params: any) {
  const qs = new URLSearchParams(params || {}).toString();
  const res = await fetch(`/api/doraemon/movie${qs ? `?${qs}` : ""}`);
  return handleResponse(res);
}

export async function getDoraemonMovieByRandom() {
  const res = await fetch("/api/doraemon/movie/random");
  return handleResponse(res);
}

export async function getDoraemonMovieCount() {
  const res = await fetch("/api/doraemon/movie/count");
  return handleResponse(res);
}
