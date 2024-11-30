import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin?: boolean;
  isCustomer?: boolean;
  permissions?: string[];
}

interface Session {
  jwt: string;
  refreshToken: string;
}

interface LoginResponse {
  message: string;
  user: User;
  session: Session;
}

interface RefreshTokenResponse {
  jwt: string;
  refreshToken: string;
}

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}

class AxiosService {
  private static instance: AxiosService;
  private axiosInstance: AxiosInstance;
  private isRefreshing: boolean = false;
  private failedQueue: QueueItem[] = [];

  private constructor() {
    this.axiosInstance = axios.create({
      // should be replaced with a env variable
      baseURL: "https://autobuy.dev/",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService();
    }
    return AxiosService.instance;
  }

  private processQueue(
    error: AxiosError | null,
    token: string | null = null
  ): void {
    this.failedQueue.forEach((promise: QueueItem) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const session = this.getAuthTokens();
        if (session?.jwt) {
          config.headers.Authorization = `Bearer ${session.jwt}`;
        }
        return config;
      },
      (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => response,
      async (error: AxiosError): Promise<any> => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (
          !error.response ||
          error.response.status !== 401 ||
          originalRequest._retry
        ) {
          return Promise.reject(error);
        }

        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers && typeof token === "string") {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return this.axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        this.isRefreshing = true;

        try {
          const response = await axios.post<RefreshTokenResponse>(
            `https://autobuy.dev/auth/refresh-token`
          );
          const { jwt: newAccessToken, refreshToken: newRefreshToken } =
            response.data;

          this.setAuthTokens(newAccessToken, newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          this.processQueue(null, newAccessToken);
          return this.axiosInstance(originalRequest);
        } catch (err) {
          this.processQueue(err as AxiosError, null);
          this.clearAuthTokens();
          window.location.href = "/login";
          return Promise.reject(err);
        } finally {
          this.isRefreshing = false;
        }
      }
    );
  }

  public setAuthTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(
      "session",
      JSON.stringify({ jwt: accessToken, refreshToken })
    );
    if (this.axiosInstance.defaults.headers.common) {
      this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
  }

  public clearAuthTokens(): void {
    localStorage.removeItem("session");
    if (this.axiosInstance.defaults.headers.common) {
      delete this.axiosInstance.defaults.headers.common.Authorization;
    }
  }

  public getAuthTokens(): Session | null {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export a singleton instance
const axiosService = AxiosService.getInstance();
export const axiosInstance = axiosService.getAxiosInstance();

// Export helper methods
export const setAuthTokens = (
  accessToken: string,
  refreshToken: string
): void => axiosService.setAuthTokens(accessToken, refreshToken);

export const clearAuthTokens = (): void => axiosService.clearAuthTokens();

export const getAuthTokens = (): Session | null => axiosService.getAuthTokens();

export default axiosInstance;
