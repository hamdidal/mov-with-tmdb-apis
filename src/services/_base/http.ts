import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";

class HttpClient {
  private readonly baseUrl: string = "https://api.themoviedb.org/3";
  private readonly axios: AxiosInstance;

  constructor() {
    const apiKey = import.meta.env.VITE_API_KEY;
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      paramsSerializer(params) {
        return qs.stringify(params, {
          encode: false,
        });
      },
    });
  }

  async get(path: string, options: AxiosRequestConfig = {}) {
    try {
      const response = await this.axios.get(path, options);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching data:", (error as Error).message);
      throw error;
    }
  }

  async post(
    path: string,
    options: any
  ){
    const response = await this.axios.post(path, options);
    return response;
  }

  async delete<P, R>(path: string, params: P): Promise<AxiosResponse<R>> {
    const response = await this.axios.delete(path, { params });
    return response;
  }
}

const httpClient = new HttpClient();
export default httpClient;
