import React from 'react';
import {Button, IButtonProps, Spinner} from 'native-base';

interface CustomButtonProps extends IButtonProps {
  title: string;
  isFullWidth?: boolean;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  testID?: string;
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  isFullWidth = true,
  variant = 'solid',
  size = 'md',
  testID,
  isLoading,
  ...props
}) => {
  return (
    <Button
      colorScheme="primary"
      variant={variant}
      size={size}
      width={isFullWidth ? 'full' : 'auto'}
      _text={{
        fontWeight: 'bold',
        fontSize: size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md',
      }}
      borderRadius="lg"
      py={size === 'sm' ? 2 : size === 'lg' ? 4 : 3}
      testID={testID}
      {...props}>
      {isLoading ? <Spinner testID="loading-spinner" color="white" /> : title}
    </Button>
  );
};

export default CustomButton;
