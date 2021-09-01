import { Input as InputBase, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';

export const Input = ({ errors, label, touched, ...props }) => (
  <FormControl id={props.name} p={4} isRequired>
    <FormLabel>{label}</FormLabel>
    <InputBase {...props} />
    {touched && <FormHelperText textColor="#e74c3c">{errors}</FormHelperText>}
  </FormControl>
); 