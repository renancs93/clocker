/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useFetch } from '@refetty/react';
import axios from 'axios'
import { subDays, addDays } from 'date-fns';

import { ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import { Button, Container, Box, IconButton, SimpleGrid, Spinner } from '@chakra-ui/react';

import { useAuth, Logo, formatDate } from './../components';

const getSchedule = async (when) =>
  axios({
    method: 'GET',
    url: '/api/schedule',
    params: {
      when: { when, username: window.location.pathname },
    },
  });


const Header = ({ children }) => {
  return(
    <Box padding={4} display='flex' justifyContent='space-between' alignItems='center' >
      {children}
    </Box>
  )
};

const TimeBlock = ({time}) => {
  return (
    <Button padding={8} bg="blue.500" color="white" >
      {time}
    </Button>
  );
}

export default function Schedule(){
  const router = useRouter();
  const [auth, { logout }] = useAuth();

  const [when, setWhen] = useState(()=> new Date());
  const [data, { loading, status, error }, fetch] = useFetch(getSchedule, {lazy: true});

  // passa o estado anterior evitando o problema de concorrência
  const addDay = () => setWhen(prevState => addDays(prevState, 1))
  const subDay = () => setWhen(prevState => subDays(prevState, 1))

  useEffect(()=>{
    fetch(getSchedule);
  },[when]);

  return (
    <Container>
      <Header>
        <Logo size={175} />
        <Button onClick={logout}>Sair</Button>
      </Header>
      <Box marginTop={8} display='flex' alignItems='center'>
        <IconButton icon={<ChevronLeftIcon />} bg='transparent' onClick={subDay} />
        <Box flex={1} textAlign='center'>{formatDate(when, 'PPPP')}</Box>
        <IconButton icon={<ChevronRightIcon />} bg='transparent' onClick={addDay} />
      </Box>
      <SimpleGrid p={4} columns={2} spacing={4}>
        { loading && <Spinner thickness="4px" speed="0.65s" emptyColor="gray.00" color="blue.500" size="xl" /> }
        { data?.map(time => <TimeBlock key={time} time={time} />) }
      </SimpleGrid>

    </Container>
  );
};
