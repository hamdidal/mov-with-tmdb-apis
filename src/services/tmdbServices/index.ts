import httpClient from "../_base/http";

export async function getReqToken() {
  try {
    const response = await httpClient.get("/authentication/token/new");
    return response;
  } catch (error: unknown) {
    console.error("Error fetching request token:", (error as Error).message);
    throw error;
  }
}

export async function createSession(requestToken: string) {
  try {
    const response = await httpClient.post("/authentication/session/new", {
      request_token: requestToken,
    });
    return response;
  } catch (error: unknown) {
    console.error("Error creating session:", (error as Error).message);
    throw error;
  }
}

export async function getPopularMovies(page?: number) {
  try {
    const response = await httpClient.get(
      `/movie/popular?language=en-US&page=${page}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching popular movies:", (error as Error).message);
  }
}

export async function getMovieDetails(movieId: number) {
  try {
    const response = await httpClient.get(`/movie/${movieId}?language=en-US`);
    return response;
  } catch (error) {
    console.error("Error fetching movie details:", (error as Error).message);
  }
}

export async function getMovieCredits(movieId: number) {
  try {
    const response = await httpClient.get(`/movie/${movieId}/credits?language=en-US`);
    return response;
  } catch (error) {
    console.error("Error fetching movie details:", (error as Error).message);
  }
}

export async function rateMovie(movieId: number, value: number, sessionId: string) {
  try {
    const response = await httpClient.post(`/movie/${movieId}/rating?session_id=${sessionId}`, {
      value: value,
    });
    return response;
  } catch (error) {
    console.error("Error rating movie:", (error as Error).message);
  }
}

export async function searchMovies(query: string, page: number) {
  try {
    const response = await httpClient.get(
      `/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`
    );
    return response;
  } catch (error) {
    console.error("Error searching movies:", (error as Error).message);
  }
}

export async function getMovieGenres() {
  try {
    const response = await httpClient.get("/genre/movie/list?language=en");
    return response
  } catch (error) {
    console.error("Error fetching movie genres:", (error as Error).message);
  }
}

export async function endSession(sessionId:string) {
  try {
    const response = await httpClient.delete(
      "/authentication/session",
      { session_id: sessionId }
    );
    return response
  } catch (error) {
    console.error("Error ending session:", (error as Error).message);
  }
}


export async function getDiscoverMovies(genreId: number, page?: number) {
  try {
    const response = await httpClient.get(`/discover/movie?include_adult=false&language=en-US&include_video=false&page=${page}&sort_by=popularity.desc&with_genres=${genreId}`);
    return response
  } catch (error) {
    console.error("Error fetching movies:", (error as Error).message);
  }
}

