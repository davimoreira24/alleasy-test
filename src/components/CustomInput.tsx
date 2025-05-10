import React, {useState, useRef} from 'react';
import {Pressable} from 'react-native';
import {
  Input,
  IInputProps,
  FormControl,
  Icon,
  Box,
  WarningOutlineIcon,
  useColorModeValue,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Controller, Control} from 'react-hook-form';

interface CustomInputProps extends IInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  isPassword?: boolean;
  name: string;
  control?: Control<any>;
  rules?: any;
  defaultValue?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  leftIcon,
  isPassword = false,
  name,
  control,
  rules,
  defaultValue = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  const labelColor = useColorModeValue('gray.600', 'darkText.200');
  const iconColor = useColorModeValue('gray.500', 'darkText.400');
  const inputColor = useColorModeValue('gray.800', 'darkText.50');
  const borderColor = useColorModeValue('gray.300', 'darkBg.400');
  const errorBorderColor = useColorModeValue('error.500', 'red.400');
  const inputBgFocus = useColorModeValue('gray.50', 'darkBg.300');
  const invalidBorderColor = useColorModeValue('error.500', 'red.400');

  if (control) {
    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({
          field: {onChange, onBlur, value},
          fieldState: {error: fieldError},
        }) => (
          <FormControl isInvalid={!!fieldError} mb={4}>
            {label && (
              <FormControl.Label
                _text={{
                  color: labelColor,
                  fontSize: 'sm',
                  fontWeight: 'medium',
                }}>
                {label}
              </FormControl.Label>
            )}

            <Box
              position="relative"
              borderWidth={1}
              borderColor={fieldError ? invalidBorderColor : borderColor}
              borderRadius="lg"
              alignItems="center"
              flexDirection="row"
              overflow="hidden"
              _dark={{
                bg: 'darkBg.200',
              }}>
              {leftIcon && (
                <Box pl={3} pr={2}>
                  <Icon
                    as={<MaterialIcons name={leftIcon} />}
                    size={5}
                    color={iconColor}
                  />
                </Box>
              )}

              <Input
                ref={inputRef}
                flex={1}
                height={12}
                py={3}
                fontSize="md"
                color={inputColor}
                borderWidth={0}
                secureTextEntry={isPassword && !showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                {...props}
                _focus={{
                  backgroundColor: inputBgFocus,
                }}
                _dark={{
                  placeholderTextColor: 'darkText.500',
                }}
              />

              {isPassword && (
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Box pr={3}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={showPassword ? 'visibility' : 'visibility-off'}
                        />
                      }
                      size={5}
                      color={iconColor}
                    />
                  </Box>
                </Pressable>
              )}
            </Box>

            {fieldError && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
                _text={{
                  color: invalidBorderColor,
                }}>
                {fieldError.message}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        )}
      />
    );
  }

  return (
    <FormControl isInvalid={!!error} mb={4}>
      {label && (
        <FormControl.Label
          _text={{color: labelColor, fontSize: 'sm', fontWeight: 'medium'}}>
          {label}
        </FormControl.Label>
      )}

      <Box
        position="relative"
        borderWidth={1}
        borderColor={error ? errorBorderColor : borderColor}
        borderRadius="lg"
        alignItems="center"
        flexDirection="row"
        overflow="hidden"
        _dark={{
          bg: 'darkBg.200',
        }}>
        {leftIcon && (
          <Box pl={3} pr={2}>
            <Icon
              as={<MaterialIcons name={leftIcon} />}
              size={5}
              color={iconColor}
            />
          </Box>
        )}

        <Input
          ref={inputRef}
          flex={1}
          height={12}
          py={3}
          fontSize="md"
          color={inputColor}
          borderWidth={0}
          secureTextEntry={isPassword && !showPassword}
          {...props}
          _focus={{
            backgroundColor: inputBgFocus,
          }}
          _dark={{
            placeholderTextColor: 'darkText.500',
          }}
        />

        {isPassword && (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Box pr={3}>
              <Icon
                as={
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                  />
                }
                size={5}
                color={iconColor}
              />
            </Box>
          </Pressable>
        )}
      </Box>

      {error && (
        <FormControl.ErrorMessage
          leftIcon={<WarningOutlineIcon size="xs" />}
          _text={{
            color: invalidBorderColor,
          }}>
          {error}
        </FormControl.ErrorMessage>
      )}
    </FormControl>
  );
};

export default CustomInput;
