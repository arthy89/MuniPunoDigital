import { ChatMessage } from '../interfaces/ChatMessage';

export async function sendMessage(userMessage: string): Promise<ChatMessage> {
  const mensaje = userMessage.toLowerCase();

  let respuesta = "Hola, ¿en qué puedo ayudarte hoy?";

  if (
    mensaje.includes('divorcio') ||
    mensaje.includes('divorciarme') ||
    mensaje.includes('divorciar') ||
    mensaje.includes('separación') ||
    mensaje.includes('separacion')
  ) {
    respuesta = `Para divorciarse según el TUPA, es necesario cumplir con algunos requisitos básicos. Algunos de ellos son:

- Que la pareja ha estado separada durante al menos un año contiguo (Artículo 19 del TUPA).
- Que uno o ambos cónyuges no tengan capacidad jurídica por algún motivo, como por enfermedad mental incurable o incapacidad física permanente.
- Que la pareja se encuentre separada de hecho y ambos hayan firmado un acta de separación (Artículo 20 del TUPA).

Para comenzar el proceso de divorcio, es necesario presentar una solicitud al Juzgado de Familia correspondiente a la Municipalidad Provincial de Puno. En la solicitud se deben incluir los documentos pertinentes y el costo total dependerá del caso específico y de las tarifas establecidas por el juzgado o por el abogado que represente al interesado.

Es recomendable consultar con un abogado especializado en derecho familiar para una mayor información sobre los requisitos exactos, los pasos a seguir y los costos de la divorcia según el TUPA de la Municipalidad Provincial de Puno.`;
  } else if (mensaje.includes('trámite') || mensaje.includes('tramite')) {
    respuesta = "Puedes realizar trámites como licencias, pagos, partidas, certificados y más en el municipio.";
  } else if (mensaje.includes('número') || mensaje.includes('numero') || mensaje.includes('teléfono')) {
    respuesta = "El número de la municipalidad es (051) 123456.";
  } else if (mensaje.includes('puedes') || mensaje.includes('ayuda')) {
    respuesta = "Puedo ayudarte con información sobre trámites, horarios, números de contacto y direcciones.";
  } else if (mensaje.includes('horario')) {
    respuesta = "Nuestro horario de atención es de lunes a viernes de 8:00 a.m. a 4:30 p.m.";
  }

  return {
    id: Date.now().toString(),
    text: respuesta,
    sender: 'bot',
    timestamp: Date.now(),
  };
}