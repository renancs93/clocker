/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useFetch } from '@refetty/react';
import axios from 'axios'
import { subDays, addDays } from 'date-fns';

import { useAuth, Logo, formatDate } from './../components';
import { ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import { Button, Container, Box, IconButton } from '@chakra-ui/react';

const getAgenda = ({ token, when }) =>
  axios({
    method: 'get',
    url: '/api/agenda',
    params: {
      when: { when },
    },
    headers: {
      Autorization: `Bearer ${token}`,
    },
  });

const Header = ({ children }) => {
  return(
    <Box padding={4} display='flex' justifyContent='space-between' alignItems='center' >
      {children}
    </Box>
  )
};

export default function Agenda(){
  const router = useRouter();
  const [auth, { logout }] = useAuth();

  const [when, setWhen] = useState(()=> new Date());
  // const [data, { loading, status, error }, fetch] = useFetch(getAgenda, {
  //   when
  // });

  const addDay = () => setWhen(addDays(when, 1))
  const subDay = () => setWhen(subDays(when, 1))

  useEffect(() => {
    !auth.user && router.push('/');
  }, [auth.user]);

  return (
    <Container>
      <Header>
        <Logo size={175} />
        <Button onClick={logout}>Sair</Button>
      </Header>
      <Box marginTop={8} display='flex' alignItems='center'>
        <IconButton icon={<ChevronLeftIcon />} bg='transparent' onClick={subDay} />
        <Box flex='1' textAlign='center'>{formatDate(when, 'PPPP')}</Box>
        <IconButton icon={<ChevronRightIcon />} bg='transparent' onClick={addDay} />
      </Box>
    </Container>
  );
};
