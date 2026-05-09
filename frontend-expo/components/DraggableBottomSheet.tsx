import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  open: boolean;
  onClose?: () => void;
  snapPoints?: (string | number)[];
  children: React.ReactNode;
};

export function DraggableBottomSheet({
  open,
  onClose,
  snapPoints = ['25%', '50%', '90%'],
  children,
}: Props) {
  const sheetRef = useRef<BottomSheet>(null);
  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      // When closed, @gorhom/bottom-sheet usually reports -1.
      if (index < 0) onClose?.();
    },
    [onClose],
  );

  useEffect(() => {
    if (!sheetRef.current) return;
    if (open) sheetRef.current.expand();
    else sheetRef.current.close();
  }, [open]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={open ? 1 : -1}
      snapPoints={memoizedSnapPoints}
      enablePanDownToClose
      onChange={handleSheetChanges}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}
    >
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 54,
  },
  background: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});

