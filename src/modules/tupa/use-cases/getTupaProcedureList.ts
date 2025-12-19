import tupaApi from '@/api/tupaApi';
import { FilterApi } from '@/interfaces/FilterApiTypes';

export const getTupaProcedureList = async ({
  page,
  limit,
  search,
}: FilterApi) => {
  const response = await tupaApi.get(`/tupa`, {
    params: { page, rowsPerPage: limit, search },
    headers: { noLoader: true },
  });
  return response.data.data;
};
