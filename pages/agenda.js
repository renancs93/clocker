/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useFetch } from '@refetty/react';
import axios from 'axios'
import { subDays, addDays, format } from 'date-fns';

import { ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import { Button, Container, Box, IconButton, Spinner, Text } from '@chakra-ui/react';

import { getToken } from '../config/firebase/client';
import { useAuth, Logo, formatDate } from './../components';

const getAgenda = async (when) =>{
  const token = await getToken();

  return axios({
    method: 'get',
    url: '/api/agenda',
    params: {
      date: format(when, 'yyyy-MM-dd'),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const Header = ({ children }) => {
  return(
    <Box padding={4} display='flex' justifyContent='space-between' alignItems='center' >
      {children}
    </Box>
  )
};

const AgendaBlock = ({ time, name, phone, ...props }) => (
  <Box {...props} display='flex' alignItems='center' bg='gray.100' borderRadius={8} p={4}>
    <Box flex={1}>{time}</Box>
    <Box textAlign='center'>
      <Text fontSize='2xl'>{name}</Text>
      <Text>{phone}</Text>
    </Box>
  </Box>
);

export default function Agenda(){
  const router = useRouter();
  const [auth, { logout }] = useAuth();

  const [when, setWhen] = useState(()=> new Date());
  const [data, { loading, status, error }, fetch] = useFetch(getAgenda, {lazy: true});

  // passa o estado anterior evitando o problema de concorrência
  const addDay = () => setWhen(prevState => addDays(prevState, 1))
  const subDay = () => setWhen(prevState => subDays(prevState, 1))

  useEffect(() => {
    !auth.user && router.push('/');
  }, [auth.user]);

  useEffect(()=>{
    fetch(when);
  },[when]);

  return (
    <Container>
      <Header>
        <Logo size={175} />
        <Button onClick={logout}>Sair</Button>
      </Header>
      <Box marginTop={8} display='flex' alignItems='center'>
        <IconButton
          icon={<ChevronLeftIcon />}
          bg='transparent'
          onClick={subDay}
        />
        <Box flex={1} textAlign='center'>
          {formatDate(when, 'PPPP')}
        </Box>
        <IconButton
          icon={<ChevronRightIcon />}
          bg='transparent'
          onClick={addDay}
        />
      </Box>

      {loading && (
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.00'
          color='blue.500'
          size='xl'
        />
      )}

      {data?.map((doc) => (
        <AgendaBlock
          key={doc.time}
          time={doc.time}
          name={doc.name}
          phone={doc.phone}
          mt={2}
        />
      ))}
    </Container>
  );
};
