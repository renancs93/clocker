import { firebaseServer } from './../../config/firebase/server';
import { differenceInHours, format, addHours } from 'date-fns'

const db = firebaseServer.firestore();
const profile = db.collection('profiles');
const agenda = db.collection('agenda');

// Para calcular o range de horários disponíveis
const startAt = new Date(2021, 1, 1, 8, 0); // das 8h
const endAt = new Date(2021, 1, 1, 17, 0); // até 17h
const totalHours = differenceInHours(endAt, startAt);

const timeBlocks = []

// Cria a lista de horários
for(let blockIndex = 0; blockIndex <= totalHours; blockIndex++){
  const time = format(addHours(startAt, blockIndex), 'HH:mm')
  timeBlocks.push(time);
}

// Recupera o valor de profiles do usuário
const getUserId = async (username) => {
  const profileDoc = await profile
    .where('username', '==', username)
    .get();

  const { userId } = profileDoc.docs[0].data();
  return userId;
}

const setSchedule = async (req, res) =>{
  const userId = await getUserId(req.body.username);
  const docId = `${userId}#${req.body.date}#${req.body.time}`
  
  const doc = await agenda.doc(docId).get()

  if(doc.exists){
    res.status(400).json({ message: 'Horário bloqueado!' });
    return;
  }

  const block = await agenda.doc(docId).set({
    userId,
    date: req.body.date,
    time: req.body.time,
    name: req.body.name,
    phone: req.body.phone,
  })
    
  return res.status(200).json(block);
}

const getSchedule = (req, res) =>{
 try {
    // const username = req.query.username;
    
    // const profileDoc = await profile
    //   .where('username', '==', username)
    //   .get();

    
    // const snapshot = await agenda
    //   .where('userId', '==', profileDoc.userId)
    //   .where('when', '==', req.query.when)
    //   .get();

    return res.status(200).json(timeBlocks);

  } 
  catch (error) {
    console.log('FB ERROR', error);
    return res.status(401);
  }
}

const methods ={
  POST: setSchedule,
  GET: getSchedule
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => methods[req.method] 
  ? methods[req.method](req, res) 
  : res.status(405);
