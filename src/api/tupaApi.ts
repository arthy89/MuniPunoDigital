import { API_URL_CORE } from '@env';
import { createApiClient } from './createApiClient';

export const API_URL_TUPA = API_URL_CORE;
const tupaApi = createApiClient({ baseURL: API_URL_TUPA });
export default tupaApi;

