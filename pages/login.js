/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'
import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  Container,
  Box,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  // Link,
} from '@chakra-ui/react';

import { Logo, useAuth } from '../components';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('E-mail inválido')
    .required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
});

const handleSubmitKeyPress = (event)=>{
  if(event.keyCode === 13){
    document.getElementById("btnEntrar").click();
  }
}

export default function Login(){
  const [auth, { login }] = useAuth();
  const router = useRouter();

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    onSubmit: login,
    validationSchema,
    initialValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    auth.user && router.push('/agenda');
  }, [auth.user]);

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
            onKeyUp={handleSubmitKeyPress}
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
            onKeyUp={handleSubmitKeyPress}
          />
          {touched.password && (
            <FormHelperText textColor='#e74c3c'>
              {errors.password}
            </FormHelperText>
          )}
        </FormControl>

        <Box p={4}>
          <Button
            id="btnEntrar"
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
