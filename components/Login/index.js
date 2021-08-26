import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect } from 'react';

import {
  Container,
  Box,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Link,
} from '@chakra-ui/react';

import { Logo } from '../Logo';
import firebase, { persistenceMode } from '../../config/firebase';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('E-mail inválido')
    .required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
});

export const Login = () => {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    onSubmit: async (values, form) => {
      
      // Persist Authentication
      firebase.auth().setPersistence(persistenceMode);
      
      try {
        const user = await firebase
          .auth()
          .signInWithEmailAndPassword(values.email, values.password);
        // console.log(user);
        // console.log(firebase.auth().currentUser);
      } catch (error) {
        console.log('ERROR: ', error);
      }
    },
    validationSchema,
    initialValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Container p={4} centerContent>
      <Logo />
      <Box p={4}>
        <Text>Crie sua agenda compartilhada</Text>
      </Box>
      <Box>
        <FormControl id='email' p={4} isRequired>
          <FormLabel>E-mail</FormLabel>
          <Input
            size='lg'
            type='email'
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && (
            <FormHelperText textColor='#e74c3c'>{errors.email}</FormHelperText>
          )}
        </FormControl>

        <FormControl id='password' p={4} isRequired>
          <FormLabel>Senha</FormLabel>
          <Input
            size='lg'
            type='password'
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password && (
            <FormHelperText textColor='#e74c3c'>
              {errors.password}
            </FormHelperText>
          )}
        </FormControl>

        <Box p={4}>
          <Button
            width='100%'
            colorScheme='blue'
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Entrar
          </Button>
        </Box>
      </Box>

      <Link href='/signup'>Ainda não tem uma conta? Cadastre-se</Link>
      
    </Container>
  );
}
