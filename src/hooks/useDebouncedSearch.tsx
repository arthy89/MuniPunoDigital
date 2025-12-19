import { useState } from 'react';
import useDebounceCallback from './useDebounceCallback';

const useDebouncedSearch = (delay = 600) => {
  const [search, setSearch] = useState('');
  const debounce = useDebounceCallback((value: string) => {
    setSearch(value);
  }, delay);

  const handleSearch = (value: string) => {
    const valueTrim = value.trim();
    if (value.length > 1 && valueTrim === '') return;
    debounce(valueTrim);
  };

  return { search, handleSearch };
};

export default useDebouncedSearch;
