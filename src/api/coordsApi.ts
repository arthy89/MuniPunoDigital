import { API_URL_COORDS } from '@env';
import { createApiClient } from './createApiClient';

// export const API_URL_COORDS;
const coordsApi = createApiClient({ baseURL: API_URL_COORDS });
export default coordsApi;