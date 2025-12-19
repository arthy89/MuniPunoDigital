// src/services/tupaApi.ts
import { useLoaderStore } from '@/store/useLoaderStore';
import { sleep } from '@/utils/sleep';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL_CORE} from '@env';

export const API_URL_PHONE_DIRECTORY = `${API_URL_CORE}`;
const tupaApi = axios.create({
  baseURL: API_URL_PHONE_DIRECTORY,
});

let requestsCount = 0;

export const showLoader = (noLoader: boolean = false) => {
  if (!noLoader) {
    if (requestsCount === 0) {
      useLoaderStore.getState().showLoader();
    }
    requestsCount++;
  }
};

export const hideLoader = (noLoader: boolean = false) => {
  if (!noLoader) {
    requestsCount--;
    if (requestsCount === 0) {
      useLoaderStore.getState().hideLoader();
    }
  }
};

// Evita logs demasiado largos
const processObject = (key: string, value: any, object: any) => {
  if (value === null || value === undefined) {
    object[key] = value;
    return;
  }

  if (typeof value === 'string') {
    object[key] = value.length <= 15000 ? value : '[DEBUG OMITIDO POR TAMAÑO]';
  } else if (typeof value === 'object' && !Array.isArray(value)) {
    let nested = {};
    for (const [k, v] of Object.entries(value)) {
      processObject(k, v, nested);
    }
    object[key] = nested;
  } else {
    object[key] = value;
  }
};

// Log completo de la petición/respuesta
const logResponse = (req: any, res: any, isError = false) => {
  try {
    let debug: any = {
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
      `LOG MUNI API: ${API_URL_PHONE_DIRECTORY}${req?.url}\n`,
      debug,
    );
  } catch (e) {
    console.error('Error al generar log de respuesta:', e);
  }
};

tupaApi.interceptors.request.use(
  async req => {
    showLoader(req.headers?.noLoader);
    await sleep(5000);
    return req;
  },
  err => {
    hideLoader(err.headers?.noLoader);
    return Promise.reject(err);
  },
);

tupaApi.interceptors.response.use(
  res => {
    hideLoader(res.config.headers?.noLoader);
    logResponse(res.config, res);
    return res;
  },
  err => {
    hideLoader(err.config.headers?.noLoader);
    logResponse(err.config, err.response, true);
    Alert.alert('Error', err.response?.data?.message || 'Unknown error', [
      { text: 'OK' },
    ]);
    return Promise.reject(err);
  },
);

export default tupaApi;
