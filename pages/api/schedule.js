import { firebaseServer } from './../../config/firebase/server';
import { differenceInHours, format, addHours } from 'date-fns'

const db = firebaseServer.firestore();
const profile = db.collection('profiles');

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

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  
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

  } catch (error) {
    console.log('FB ERROR', error);
    return res.status(401);
  }
};
