import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup'
import axios from 'axios'

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter
} from '@chakra-ui/react';

import { Input } from '../Input';
import { format } from 'date-fns';

const setSchedule = async ({date, ...data}) =>
  axios({
    method: 'POST',
    url: '/api/schedule',
    data: {
      ...data,
      date: format(date, 'yyyy-MM-dd'),
      username: window.location.pathname.replace('/', ''),
    },
  });

const ModalTimeBlock = ({isOpen, onClose, onComplete, isSubmitting, children}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Reserve seu horário</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {children}
      </ModalBody>

      <ModalFooter>
        {!isSubmitting && <Button variant="ghost" marginRight={1} onClick={onClose}>Cancelar</Button>}
        <Button colorScheme="blue" mr={3} onClick={onComplete} isLoading={isSubmitting}>
          Reservar Horário
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)
  
export const TimeBlock = ({ time, date }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prevState) => !prevState);

  const {
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    onSubmit: async (values) => {
      try{
        await setSchedule({ ...values, time, date});
        toggle();
      }
      catch(error){
        console.log(error);
      }
    },
    initialValues: {
      name: '',
      phone: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Preenchimento obrigatório'),
      phone: yup.string().required('Preenchimento obrigatório'),
    }),
  });

  return (
    <Button padding={8} bg='blue.500' color='white' onClick={toggle}>
      {time}

      <ModalTimeBlock
        isOpen={isOpen}
        onClose={toggle}
        onComplete={handleSubmit}
        isSubmitting={isSubmitting}
      >
        <>
          <Input
            label='Nome:'
            name='name'
            touched={touched.name}
            errors={errors.name}
            value={values.name}
            placeholder='Digite seu nome'
            onChange={handleChange}
            onBlur={handleBlur}
            size='lg'
            disable={isSubmitting}
          />
          <Input
            label='Telefone:'
            name='phone'
            touched={touched.name}
            errors={errors.name}
            value={values.phone}
            placeholder='(99) 9 9999-9999'
            onChange={handleChange}
            onBlur={handleBlur}
            size='lg'
            disable={isSubmitting}
          />
        </>
      </ModalTimeBlock>
    </Button>
  );
};