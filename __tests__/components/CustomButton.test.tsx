import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {NativeBaseProvider} from 'native-base';
import CustomButton from '../../src/components/CustomButton';

const inset = {
  frame: {x: 0, y: 0, width: 0, height: 0},
  insets: {top: 0, left: 0, right: 0, bottom: 0},
};

const Wrapper = ({children}: {children: React.ReactNode}) => (
  <NativeBaseProvider initialWindowMetrics={inset}>
    {children}
  </NativeBaseProvider>
);

describe('CustomButton', () => {
  it('deve renderizar corretamente com propriedades básicas', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(
      <CustomButton title="Botão de Teste" onPress={onPressMock} />,
      {wrapper: Wrapper},
    );

    expect(getByText('Botão de Teste')).toBeTruthy();
  });

  it('deve chamar a função onPress quando pressionado', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(
      <CustomButton title="Clique Aqui" onPress={onPressMock} />,
      {wrapper: Wrapper},
    );

    const button = getByText('Clique Aqui');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('deve exibir o spinner de loading quando isLoading é true', () => {
    const {getByTestId} = render(
      <CustomButton
        title="Carregando"
        onPress={() => {}}
        isLoading={true}
        isLoadingText="Aguarde..."
      />,
      {wrapper: Wrapper},
    );

    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  it('deve aplicar estilos personalizados', () => {
    const {getByTestId} = render(
      <CustomButton
        title="Estilizado"
        onPress={() => {}}
        bg="red.500"
        borderRadius="xl"
        testID="custom-button"
      />,
      {wrapper: Wrapper},
    );

    const buttonElement = getByTestId('custom-button');

    expect(buttonElement.props.style).toBeDefined();
  });

  it('deve aplicar a variante corretamente', () => {
    const {getByTestId} = render(
      <CustomButton
        title="Variante"
        onPress={() => {}}
        variant="outline"
        testID="variant-button"
      />,
      {wrapper: Wrapper},
    );

    const buttonElement = getByTestId('variant-button');

    expect(buttonElement.props.style).toBeDefined();
  });
});
