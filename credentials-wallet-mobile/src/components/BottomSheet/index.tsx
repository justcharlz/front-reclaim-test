import {H1} from '@app/lib/styles/common';
import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import CancelButton from '../CancelButton';
import {
  BottomSheetBody,
  BottomSheetContainer,
  BottomSheetFooter,
  Container,
  Header,
  LinkContainer,
  LinkHeader,
} from './styles';

interface Props {
  title: string;
  bottomSheetRef: React.RefObject<BottomSheet>;
  onChange: (index: number) => void;
  children: React.ReactNode;
  setOpenSheet: (value: boolean) => void;
  snapPoints: string[];
}

const BottomSheetView: React.FC<Props> = ({
  title,
  bottomSheetRef,
  onChange,
  children,
  setOpenSheet,
  snapPoints,
}) => {
  return (
    <BottomSheetContainer
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={onChange}>
      <Container>
        <Header>
          <H1>{title}</H1>
          <CancelButton
            onPress={() => {
              setOpenSheet(false);
            }}
          />
        </Header>
        {children}
      </Container>
    </BottomSheetContainer>
  );
};

export default BottomSheetView;