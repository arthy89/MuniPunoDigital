import Geolocation from "@react-native-community/geolocation";
import { useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { isLocationEnabled, promptForEnableLocationIfNeeded } from "react-native-android-location-enabler";
import { LatLng, Region } from "react-native-maps";


// ✅ Verificar si el GPS está activado
async function handleCheckPressed() {
  if (Platform.OS === 'android') {
    const checkEnabled: boolean = await isLocationEnabled();
    // Solo log si está deshabilitado
    if (!checkEnabled) {
      console.log('GPS deshabilitado');
    }
    return checkEnabled;
  }
}
async function handleEnabledPressed() {
    if (Platform.OS === 'android') {
      try {
        const enableResult = await promptForEnableLocationIfNeeded();
        console.log('enableResult', enableResult);
        // The user has accepted to enable the location services
        // data can be :
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        }
      }
    }
  }
async function requestLocationPermission() {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Permiso de ubicación',
                message: 'Esta app necesita acceder a tu ubicación.',
                buttonNeutral: 'Pregúntame luego',
                buttonNegative: 'Cancelar',
                buttonPositive: 'Aceptar',
            }
        );
        const isEnabled = await handleCheckPressed();
        if (!isEnabled) {
            await handleEnabledPressed();
        }

        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS normalmente se maneja desde el Info.plist
    return true;
}


export default requestLocationPermission;

//