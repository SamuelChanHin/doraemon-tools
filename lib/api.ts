function handleResponse(res: Response) {
  if (!res.ok) {
    return res.json().then((body) => {
      const err = new Error(body.message || "API Error");
      err.status = body.statusCode || res.status;
      throw err;
    });
  }
  return res.json();
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
