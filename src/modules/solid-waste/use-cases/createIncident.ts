import muniApi from '@/api/muniApi';
import { SolidWasteFormData } from '../validations/SolidWasteFormScheme';
import { sleep } from '@/utils/sleep';

interface BodyIncident extends SolidWasteFormData {
  location: {
    lat: number;
    lng: number;
  };
}

export const createIncident = async (data: BodyIncident) => {
  const formData = new FormData();
  formData.append('incidencia[catalogo_id]', data.incident.value);
  formData.append('incidencia[descripcion]', data.description);
  formData.append('incidencia[celular]', data.phone);
  formData.append(
    'incidencia[ubicacion]',
    JSON.stringify({
      lat: data.location.lat,
      lng: data.location.lng,
    }),
  );
  data.media.forEach(({ date, uri, type }, index) => {
    formData.append('incidencia[fotografias][][uri]', {
      uri: `file://${uri}`,
      type,
      name: `foto_${index}.jpg`,
      // date,
    });
    formData.append('incidencia[fotografias][][date]', date);
    // formData.append('incidencia[fotografias][][uri]', 'test');
  });

  console.log('asdFormada', formData);
  const response = await muniApi.post('/incidencias', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response;

  // muniApi.console.log('asdFormada', formData);
};
