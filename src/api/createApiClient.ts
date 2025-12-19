// src/services/createApiClient.ts
import axios, { AxiosInstance } from 'axios';
import { useLoaderStore } from '@/store/useLoaderStore';
import { Alert } from 'react-native';

type CreateApiClientOptions = {
  baseURL: string;
};
let requestsCount = 0;

export const showLoader = (noLoader: boolean = false) => {
  if (!noLoader && requestsCount === 0) {
    useLoaderStore.getState().showLoader();
  }
  if (!noLoader) requestsCount++;
};

export const hideLoader = (noLoader: boolean = false) => {
  if (!noLoader) {
    requestsCount--;
    if (requestsCount === 0) {
      useLoaderStore.getState().hideLoader();
    }
  }
};
export const createApiClient = ({
  baseURL,
}: CreateApiClientOptions): AxiosInstance => {
  const api = axios.create({ baseURL });

  const processObject = (key: string, value: any, object: any) => {
    if (value === null || value === undefined) {
      object[key] = value;
      return;
    }
    if (typeof value === 'string') {
      object[key] =
        value.length <= 15000 ? value : '[DEBUG OMITIDO POR TAMAÑO]';
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      const nested: any = {};
      for (const [k, v] of Object.entries(value)) {
        processObject(k, v, nested);
      }
      object[key] = nested;
    } else {
      object[key] = value;
    }
  };

  const logResponse = (req: any, res: any, isError = false) => {
    try {
      const debug: any = {
        url: req?.url,
        method: req?.method?.toUpperCase(),
        headers: req?.headers,
      };
      if (req?.data) {
        debug.data = {};
        const parsedData =
          typeof req.data === 'string' ? JSON.parse(req.data) : req.data;
        Object.entries(parsedData).forEach(([key, value]) =>
          processObject(key, value, debug.data),
        );
      }
      debug.response = {};
      const responseData = res?.data || res;
      Object.entries(responseData).forEach(([key, value]) =>
        processObject(key, value, debug.response),
      );

      console[isError ? 'error' : 'log'](
        `LOG API: ${baseURL}${req?.url}\n`,
        debug,
      );
    } catch (e) {
      console.error('Error al generar log de respuesta:', e);
    }
  };

  api.interceptors.request.use(
    async req => {
      showLoader(req.headers?.noLoader);
      return req;
    },
    err => {
      hideLoader(err.config?.headers?.noLoader);
      return Promise.reject(err);
    },
  );

  api.interceptors.response.use(
    res => {
      hideLoader(res.config?.headers?.noLoader);
      logResponse(res.config, res);
      return res;
    },
    err => {
      hideLoader(err.config?.headers?.noLoader);
      logResponse(err.config, err.response, true);
      Alert.alert('Error', err.response?.data?.message || 'Unknown error', [
        { text: 'OK' },
      ]);
      return Promise.reject(err);
    },
  );

  return api;
};
