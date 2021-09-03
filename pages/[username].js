/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useFetch } from '@refetty/react';
import axios from 'axios'
import { subDays, addDays, format } from 'date-fns';

import { Logo, formatDate, TimeBlock } from './../components';
import { ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import {
  Container,
  Box,
  IconButton,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';

const getSchedule = async ({when, username}) => axios({
  method: 'GET',
  url: '/api/schedule',
  params: {
    username: username,
    date: format(when, 'yyyy-MM-dd'),
  },
});

const Header = ({ children }) => {
  return(
    <Box padding={4} display='flex' justifyContent='space-between' alignItems='center' >
      {children}
    </Box>
  )
};

export default function Schedule(){
  const router = useRouter();
  const [when, setWhen] = useState(()=> new Date());
  const [data, { loading, status, error }, fetch] = useFetch(getSchedule, {lazy: true});

  // passa o estado anterior evitando o problema de concorrência
  const addDay = () => setWhen(prevState => addDays(prevState, 1))
  const subDay = () => setWhen(prevState => subDays(prevState, 1))

  const refresh = () => {
    fetch({when, username: router.query.username});
  }

  useEffect(()=>{
    refresh()
  },[when, router.query.username]);

  // if(error){
  //   redirect(404)
  // }

  return (
    <Container>
      <Header>
        <Logo size={175} />
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
      <SimpleGrid p={4} columns={2} spacing={4}>
        {loading && (
          <Spinner 
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.00'
            color='blue.500'
            size='xl'
          />
        )}
        {data?.map(({ time, isBlocked }) => (
          <TimeBlock key={time} time={time} date={when} disabled={isBlocked} onSucess={refresh} />
        ))}
      </SimpleGrid>
    </Container>
  );
};
