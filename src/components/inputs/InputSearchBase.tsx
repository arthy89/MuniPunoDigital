import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import type { StyleProp } from 'react-native';
import InputBase, { InputBaseProps } from './InputBase';
//import { GOOGLE_PLACES_API_KEY } from '@/config/env';
import theme from '@/theme/theme';
import axios from 'axios';
import { set } from 'react-hook-form';
import { useRouteStore } from '@/modules/micro-puno/resources/useRouteStore';
interface Prediction {
  description: string;
  place_id: string;
}

interface InputSearchBaseProps extends InputBaseProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: TextStyle;
  onSelectPlace?: (place: Prediction) => void;
  enableClearIcon?: boolean; // controla si se muestra la X azul
  onPredictionsLoadingChange?: (loading: boolean) => void; // notifica inicio/fin de carga
}

const InputSearchBase = ({
  value = '',
  onChangeValue,
  onSelectPlace,
  containerStyle,
  inputStyle,
  ...inputProps
}: InputSearchBaseProps) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Prediction[]>([]);
  const { setListPredictions } = useRouteStore();
  
  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const getAutocomplete = async (input: string) => {
      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
          params: {
            input,
            key: 'AIzaSyAEWdhPlzOFzTPj5O-4mw293_clHfLI5QA', // reemplaza con tu API key real
            language: 'es',
            components: 'country:pe',
            location: '-15.8402,-70.0219', // Coordenadas del centro de Puno
            radius: 50000 // en metros, por ejemplo 50km
          },
        });
       
        console.log('Autocomplete response:', response.data.predictions);
        setResults(response.data.predictions);
        setListPredictions(response.data.predictions);
        return response.data.predictions;

      } catch (error) {
        console.warn('Error al obtener autocompletado:', error);
        return [];
      }
    };

    const timeout = setTimeout(() => { getAutocomplete(query) }, 500);
    return () => clearTimeout(timeout);
  }, [query]);


  const handleSelect = (place: Prediction) => {
    setQuery(place.description);
    setResults([]);
    onChangeValue?.(place.description);
    onSelectPlace?.(place);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    onChangeValue?.('');
  };

  return (
    <>
      <InputBase
        value={query}
        onChangeValue={setQuery}
        iconRight={query.length > 0 ? 'remove' : undefined}
        onPressInRight={handleClear}
        inputStyle={inputStyle}
        {...inputProps}
        containerStyle={[{ flex: 1 }, containerStyle]}
      />
      
    </>
  );
};

export default InputSearchBase;
