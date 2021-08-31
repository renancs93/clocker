/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import Link from 'next/link'
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
  InputGroup,
  InputLeftAddon,
  // Link,
} from '@chakra-ui/react';

import { Logo, useAuth } from './../components';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('E-mail inválido')
    .required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
  username: yup.string().required('Preenchimento obrigatório'),
});

export default function Signup() {
  const [auth, {signup}] = useAuth();
  const router = useRouter();
  
  const { values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting } =
    useFormik({
      onSubmit: signup,
      validationSchema,
      initialValues: {
        email: '',
        username: '',
        password: '',
      },
    });

    useEffect(()=>{
      auth.user && router.push('/agenda');
    }, [auth.user])

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

        <FormControl id='username' p={4} isRequired>
          <InputGroup size='lg'>
            <InputLeftAddon children='clocker.work/' />
            <Input
              size='lg'
              type='username'
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </InputGroup>
          {touched.username && (
            <FormHelperText textColor='#e74c3c'>
              {errors.username}
            </FormHelperText>
          )}
        </FormControl>

        <Box p={4}>
          <Button width='100%' colorScheme="blue" onClick={handleSubmit} isLoading ={isSubmitting} >
            Criar Conta
          </Button>
        </Box>
      </Box>

      <Link href="/">Já tem uma conta? Acesse!</Link>

    </Container>
  );
}
