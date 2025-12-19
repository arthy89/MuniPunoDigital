import { API_URL_RESIDUOS } from '@env';
import { createApiClient } from './createApiClient';

export const API_URL_MUNI = `${API_URL_RESIDUOS}`;

const muniApi = createApiClient({ baseURL: API_URL_MUNI });

export default muniApi;
