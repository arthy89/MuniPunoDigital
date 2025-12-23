import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Alert, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ModalProps {
  onButtonSheetRef: React.RefObject<BottomSheetModal | null>;
  snapPoints?: string[]; 
  children?: React.ReactNode;
  onClosePress?: () => void; // Permite personalizar el comportamiento de la X
}

const BottomSheetModalComponent: React.FC<ModalProps> = ({
  onButtonSheetRef,
  children,
  snapPoints,
  onClosePress,
}) => {
  const snapPointsInitial = useMemo(() => ['55%', '100%'], []);
  const snapPointsInitial1 = useMemo(() => ['33%', '100%'], []);

  // FIX: El BottomSheetModal se cerraba incluso al hacer click en zonas vacías del modal.
  // Solución: usamos BottomSheetBackdrop con pressBehavior="close" para que solo cierre
  // al tocar fuera del BottomSheet (fuera del área visible).
  // Esto evita que se cierre cuando el usuario interactúa con contenido del modal.
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close" // Esto hace que se cierre solo al tocar fuera del BottomSheet
      />
    ),
    [],
  );

    const handleSheetModalStop = useCallback(() => {
      if (onClosePress) {
        onClosePress();
        return;
      }
      onButtonSheetRef?.current?.dismiss();
    }, [onButtonSheetRef, onClosePress]);



  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={onButtonSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustResize"
        //onDismiss={handleSheetModalStop}
        //backdropComponent={renderBackdrop}
        >
        <BottomSheetView style={styles.content}>
          <TouchableOpacity style={styles.iconClose} onPress={handleSheetModalStop}>
            <Icon name="close" size={30} color="#000" />
          </TouchableOpacity>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  
  iconClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 20,
    padding: 8,
    zIndex:10,
  },
});

export default BottomSheetModalComponent;
