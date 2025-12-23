
import theme from '@/theme';
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, FlatList, Image } from 'react-native';
import { LatLng } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InputSearchBase from '@/components/inputs/InputSearchBase';
import { useForm } from 'react-hook-form';
import { useLineLoaderAnimation } from '../hooks/useLineLoader';
import Geocoder from "react-native-geocoding";
import { useRouteStore } from '../resources/useRouteStore';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { getRutasList } from '../use-cases/getRutasList';

interface SearchRoutesProps {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    handleToggleRoutes: (fromSearch?: boolean) => void;
    show: boolean;
    userLocation?: LatLng;
    centerCoords?: LatLng; // Coordenadas centrales del mapa en modo selección manual
    pinGreen?: any;
    pinRed?: any;
}

export interface SearchRoutesHandle {
    clearAutocompleteIfSelecting: () => void;
}


Geocoder.init("AIzaSyAEWdhPlzOFzTPj5O-4mw293_clHfLI5QA");
const SearchRoutes = forwardRef<SearchRoutesHandle, SearchRoutesProps>(({ setShow, userLocation, show, handleToggleRoutes, centerCoords, pinGreen, pinRed }, ref) => {

    const [activeInput, setActiveInput] = useState<'origen' | 'destino' | null>(null);
    const listPredictions = useRouteStore((state) => state.listPredictions);
    const setListPredictions = useRouteStore((state) => state.setListPredictions);
    const setFetchedRoutes = useRouteStore((state) => state.setFetchedRoutes);
    const setOriginPoint = useRouteStore((s) => s.setOriginPoint);
    const setDestinationPoint = useRouteStore((s) => s.setDestinationPoint);
    const setIsOriginDynamic = useRouteStore((s) => s.setIsOriginDynamic);
    const form = useForm<{
        origen: string;
        destino: string;
    }>();
    const animatedStyle = useLineLoaderAnimation();
    const [previewAddress, setPreviewAddress] = useState<string>('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const predictionsOpacity = useSharedValue(0);
    // Control para mostrar acciones solo cuando ambos inputs tengan valor
    const origenValue = form.watch('origen');
    const destinoValue = form.watch('destino');
    // Bloqueo de predicciones tras selección hasta nueva escritura
    const [predictionsLocked, setPredictionsLocked] = useState(false);
    const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);

    const handleRutasCercanas = async () => {
        if (!origenCoords || !destinoCoords) return;
        try {
            const data = await getRutasList({ origen: origenCoords, destino: destinoCoords });
            let routesArray: any[] = [];
            if (Array.isArray(data)) routesArray = data;
            else if (Array.isArray(data?.routes)) routesArray = data.routes;
            else if (Array.isArray(data?.rutas)) routesArray = data.rutas;
            else if (data) routesArray = [data];
            setFetchedRoutes(routesArray.slice(0, 3));
        } catch (error) {
            console.error('Error al obtener rutas del backend:', error);
        }
    }

    const [origenCoords, setOrigenCoords] = useState<LatLng | null>(null);
    const [destinoCoords, setDestinoCoords] = useState<LatLng | null>(null);
    // Inputs válidos solo si hay coordenadas establecidas (sugerencia seleccionada, mapa o Mi ubicación)
    const canShowRouteActions = !!origenCoords && !!destinoCoords;
    // Invalid flags: texto presente pero sin coordenadas
    const origenText = origenValue?.trim();
    const destinoText = destinoValue?.trim();
    const isOrigenInvalid = show && !predictionsLocked && !!origenText && !origenCoords;
    const isDestinoInvalid = show && !predictionsLocked && !!destinoText && !destinoCoords;
    // Valid flags: coordenadas establecidas
    const isOrigenValid = !!origenCoords;
    const isDestinoValid = !!destinoCoords;
    // Refs para enfocar inputs programáticamente
    const origenInputRef = useRef<TextInput>(null);
    const destinoInputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
        clearAutocompleteIfSelecting: () => {
            if (show) return; // Solo limpiar si estamos en modo selección en el mapa
            if (!activeInput) return;

            // Limpiar predicciones y bloqueo
            setListPredictions([]);
            setPredictionsLocked(true);
            setPreviewAddress('');

            // Limpiar valores según input activo
            if (activeInput === 'origen') {
                form.setValue('origen', '');
                setOrigenCoords(null);
                setOriginPoint(null);
                setIsOriginDynamic(false);
            } else if (activeInput === 'destino') {
                form.setValue('destino', '');
                setDestinoCoords(null);
                setDestinationPoint(null);
            }
        }
    }));

    const handleSelect = async (place: any) => {
        if (activeInput === 'origen') {
            form.setValue('origen', place.description);
            try {
                const response = await Geocoder.from(place.description);
                const location = response.results[0].geometry.location;
                const coords = {
                    latitude: location.lat,
                    longitude: location.lng,
                };
                setOrigenCoords(coords);
                setOriginPoint(coords);
                setIsOriginDynamic(false);
                // Cambiar al input de destino sin cerrar el teclado
                setTimeout(() => {
                    setActiveInput('destino');
                    setListPredictions([]);
                    setPredictionsLocked(true);
                    destinoInputRef.current?.focus();
                }, 100);
            } catch (error) {
                setOrigenCoords(null);
                setOriginPoint(null);
                console.warn('No se pudo obtener coordenadas de origen:', error);
            }
        } else if (activeInput === 'destino') {
            form.setValue('destino', place.description);
            try {
                const response = await Geocoder.from(place.description);
                const location = response.results[0].geometry.location;
                const coords = {
                    latitude: location.lat,
                    longitude: location.lng,
                };
                setDestinoCoords(coords);
                setDestinationPoint(coords);
            } catch (error) {
                setDestinoCoords(null);
                setDestinationPoint(null);
                console.warn('No se pudo obtener coordenadas de destino:', error);
            }
            // Cerrar teclado solo cuando se completa el destino
            Keyboard.dismiss();
        }
        setListPredictions([]);
        setPredictionsLocked(true);
    };
    const getUserDirection = async () => {
        if (userLocation && activeInput === 'origen') {
            const userDireccion = await geocodeLatLng({ latitude: userLocation.latitude, longitude: userLocation.longitude });
            if (userDireccion) {
                form.setValue('origen', userDireccion);
                setOrigenCoords(userLocation);
                setOriginPoint(userLocation);
                setIsOriginDynamic(true);
                // Cambiar al input de destino sin cerrar el teclado
                setTimeout(() => {
                    setActiveInput('destino');
                    setListPredictions([]);
                    setPredictionsLocked(true);
                    destinoInputRef.current?.focus();
                }, 100);
            }
        }
    };


    const geocodeLatLng = async (input: LatLng): Promise<string> => {
        try {
            const response = await Geocoder.from(input.latitude, input.longitude);
            const result = response.results[0];
            return result?.address_components[1]?.short_name + ' ' + result?.address_components[0]?.short_name || 'Dirección no encontrada';
        } catch (error) {
            console.warn('Error al obtener dirección:', error);
            return 'Error al obtener dirección';
        }
    };

    const buscarRutaPin = async () => {
        if (!activeInput || !centerCoords) {
            setShow(true);
            return;
        }
        try {
            const direccion = previewAddress || await geocodeLatLng(centerCoords);
            if (activeInput === 'origen') {
                form.setValue('origen', direccion);
                setOrigenCoords(centerCoords);
                setOriginPoint(centerCoords);
                setIsOriginDynamic(false);
                setTimeout(() => {
                    setActiveInput('destino');
                    setListPredictions([]);
                    setPredictionsLocked(true);
                    destinoInputRef.current?.focus();
                }, 300);
            } else if (activeInput === 'destino') {
                form.setValue('destino', direccion);
                setDestinoCoords(centerCoords);
                setDestinationPoint(centerCoords);
            }
        } catch (e) {
            console.warn('Error geocodificando la coordenada seleccionada:', e);
        }
        setShow(true);
    }

    // Geocodificar el centro del mapa en modo selección manual
    useEffect(() => {
        if (show) return;
        if (!centerCoords) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const dir = await geocodeLatLng(centerCoords);
                setPreviewAddress(dir);
                if (activeInput) {
                    form.setValue(activeInput, dir);
                }
            } catch (e) {
                setPreviewAddress('Dirección no disponible');
            }
        }, 500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [centerCoords, show]);

    // Apagar loader de predicciones cuando lleguen resultados o cuando se bloqueen
    useEffect(() => {
        if (!show) return; // solo aplica en drawer
        if (predictionsLocked) {
            setIsLoadingPredictions(false);
            return;
        }
        // si hay resultados o si el usuario dejó vacío el input activo
        const currentValue = activeInput ? form.getValues(activeInput) : '';
        if ((listPredictions && listPredictions.length > 0) || !currentValue) {
            setIsLoadingPredictions(false);
        }
    }, [listPredictions, predictionsLocked, activeInput, show]);

    // Animar la opacidad del FlatList de predicciones
    useEffect(() => {
        if (listPredictions.length > 0 && !predictionsLocked) {
            predictionsOpacity.value = withTiming(1, { duration: 200 });
        } else {
            predictionsOpacity.value = withTiming(0, { duration: 150 });
        }
    }, [listPredictions, predictionsLocked, predictionsOpacity]);


    return (
        <View style={styles.container} >
            <Text style={styles.title}>{show ? 'Chapa tu micro' : activeInput === 'origen' ? 'Ubicación de partida' : 'Ubicación de destino'} </Text>
            <View style={styles.inputBox}>
                {
                    (show || activeInput === 'origen') && (
                        <View style={styles.inputRow}>
                            {pinGreen ? (
                                <Image source={pinGreen} style={styles.pinIcon} />
                            ) : (
                                <Icon name="place" size={20} color="#0088cc" style={styles.icon} />
                            )}
                            <InputSearchBase
                                containerStyle={[
                                    styles.input,
                                    isOrigenValid ? { borderColor: '#4CAF50', borderWidth: 1 } : isOrigenInvalid ? { borderColor: '#e53935', borderWidth: 1 } : null,
                                ]}
                                placeholder="Ubicación de partida ..."
                                value={origenValue || ''}
                                inputRef={origenInputRef}
                                editable={show} 
                                enableClearIcon={show}
                                onFocus={() => {
                                    setActiveInput('origen');
                                    setListPredictions([]);
                                    setPredictionsLocked(false);
                                }}
                                onChangeValue={(text: string) => {
                                    form.setValue('origen', text);
                                    if (text.trim().length === 0) {
                                        setListPredictions([]);
                                        setPredictionsLocked(true);
                                        setOrigenCoords(null);
                                        setOriginPoint(null);
                                        setIsOriginDynamic(false);
                                        setIsLoadingPredictions(false);
                                    } else {
                                        setPredictionsLocked(false);
                                        setIsLoadingPredictions(true);
                                    }
                                }}
                            />

                        </View>
                    )
                }
                {
                    show &&
                    (
                        <View style={styles.lineSeparatorCategory} ></View>
                    )
                }
                {
                    (show || activeInput === 'destino') && (
                        <View style={styles.inputRow}>
                            {pinRed ? (
                                <Image source={pinRed} style={styles.pinIcon} />
                            ) : (
                                <Icon name="flag" size={20} color="#0088cc" style={styles.icon} />
                            )}
                            <InputSearchBase
                                containerStyle={[
                                    styles.input,
                                    isDestinoValid ? { borderColor: '#4CAF50', borderWidth: 1 } : isDestinoInvalid ? { borderColor: '#e53935', borderWidth: 1 } : null,
                                ]}
                                placeholder="¿A dónde vamos?"
                                value={destinoValue || ''}
                                inputRef={destinoInputRef}
                                editable={show}
                                enableClearIcon={show}
                                onFocus={() => {
                                    setActiveInput('destino');
                                    setListPredictions([]);
                                    setPredictionsLocked(false);
                                }}
                                onChangeValue={(text: string) => {
                                    form.setValue('destino', text);
                                    if (text.trim().length === 0) {
                                        setListPredictions([]);
                                        setPredictionsLocked(true);
                                        setDestinoCoords(null);
                                        setDestinationPoint(null);
                                        setIsLoadingPredictions(false);
                                    } else {
                                        setPredictionsLocked(false);
                                        setIsLoadingPredictions(true);
                                    }
                                }}
                            />

                        </View>
                    )
                }
            </View>
            {
                show ? (
                    <>
                        {activeInput === "origen" && (
                            <TouchableOpacity
                                style={styles.optionRow}
                                onPress={() => {
                                    getUserDirection();
                                }}
                            >
                                <Icon name="my-location" size={20} color="#0088cc" style={styles.icon} />
                                <Text style={styles.optionText}>Mi ubicación</Text>
                            </TouchableOpacity>)}
                        {activeInput && (
                            <TouchableOpacity style={styles.optionRow} onPress={() => { 
                                setShow(false); 
                                Keyboard.dismiss(); 
                            }}>
                                <Icon name="map" size={20} color="#0088cc" style={styles.icon} />
                                <Text style={styles.optionText}>Establecer ubicación en el mapa</Text>
                            </TouchableOpacity>
                        )}
                        {listPredictions.length > 0 && !predictionsLocked && (
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    maxHeight: 500,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 2,
                                    borderRadius: 0,
                                }}>
                                <FlatList
                                    data={listPredictions}
                                    keyExtractor={(item) => item.place_id}
                                    keyboardShouldPersistTaps="handled"
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={async () => await handleSelect(item)}
                                            style={{
                                                paddingVertical: 10,
                                                borderBottomWidth: 1,
                                                borderColor: "#eee",
                                            }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}> 
                                                <Icon name="location-on" size={20} color="#0088cc" />
                                                <View style={{ marginLeft: 10 }}>
                                                    <Text style={{ color: "#000", fontWeight: 'bold' }}>
                                                        {item.structured_formatting.main_text}
                                                    </Text>
                                                    <Text style={{ color: "#000" }}>
                                                        {item.structured_formatting.secondary_text}
                                                    </Text>
                                                </View>
                                            </View>

                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}
                        {/* Espacio fijo para evitar que el modal se redimensione */}
                        {!(listPredictions.length > 0 && !predictionsLocked) && (
                            <View style={{ height: 0 }} />
                        )}
                        {show && isLoadingPredictions && (
                            <View style={styles.lineBackground}>
                                <Animated.View style={[styles.indicator, animatedStyle]} />
                            </View>
                        )}
                        <TouchableOpacity
                            style={[
                                styles.optionRowB,
                                !canShowRouteActions ? { opacity: 0.5 } : null,
                            ]}
                            disabled={!canShowRouteActions}
                            onPress={() => {
                                if (!canShowRouteActions) return;
                                handleToggleRoutes(true);
                                handleRutasCercanas();
                            }}
                        >
                            <Icon name="search" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.optionTextB}>Buscar micros</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.confirmBtn}
                            onPress={() => buscarRutaPin()}
                        >
                            <Text style={styles.confirmText}>
                                {activeInput === 'origen' ? 'Confirmar partida' : 'Confirmar destino'}
                            </Text>
                        </TouchableOpacity>
                    </>
                )
            }
        </View >
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 17,
        color: theme.colors.black,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        color: '#666',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 12,
    },
    closeBtn: {
        position: 'absolute',
        right: 12,
        top: 12,
        padding: 4,
        zIndex: 2,
    },
    inputBox: {
        borderWidth: 2,
        borderColor: '#0088cc',
        borderRadius: 8,
        padding: 8,
        marginBottom: 5,
        backgroundColor: '#f7fafd',
        width: '100%',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        paddingVertical: 6,
        height: 60, 
    },
    icon: {
        marginVertical: 5,
    },
    pinIcon: {
        width: 20,
        height: 20,
        marginVertical: 5,
        resizeMode: 'contain',
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#000000',
        borderWidth: 0.5,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionRowB: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#0088cc',
        borderRadius: 8,
        color: '#fff',
    },
    optionText: {
        fontSize: 15,
        color: '#222',
        marginLeft: 8,
    },
    optionTextB: {
        fontSize: 15,
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    confirmBtn: {
        backgroundColor: '#0088cc',
        borderRadius: 8,
        paddingVertical: 14,
        width: '100%',
        alignItems: 'center',
        color: '#000',
    },
    confirmText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    lineSeparatorCategory: {
        height: 1,
        backgroundColor: theme.colors.textPlaceholder,
        opacity: 0.5,
        marginVertical: theme.spacing.xs,
        marginLeft: 30
    },
    lineBackground: {
        width: '100%',
        height: 4,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 3,
    },
    indicator: {
        width: 40,
        height: 3,
        backgroundColor: '#000000',
        borderRadius: 2,
    },
    previewText: {
        color: '#333',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 8,
    },
});

export default SearchRoutes;