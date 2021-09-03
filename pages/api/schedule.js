import { firebaseServer } from './../../config/firebase/server';
import { differenceInHours, format, addHours } from 'date-fns'

// Firestore
const db = firebaseServer.firestore();
//db.settings({ignoreUndefinedProperties: true});

const profile = db.collection('profiles');
const agenda = db.collection('agenda');

// Para calcular o range de horários disponíveis
const startAt = new Date(2021, 1, 1, 8, 0); // das 8h
const endAt = new Date(2021, 1, 1, 17, 0); // até 17h
const totalHours = differenceInHours(endAt, startAt);

const timeBlocksList = []

// Cria a lista de horários
for(let blockIndex = 0; blockIndex <= totalHours; blockIndex++){
  const time = format(addHours(startAt, blockIndex), 'HH:mm')
  timeBlocksList.push(time);
}

// Recupera o valor de profiles do usuário
const getUserId = async (username) => {
  try {
    //console.log(">>>>>>>>> getUserId: ", username); // remover
    if(!username){
      return false;
    }

    const profileDoc = await profile.where('username', '==', username).get();

    if (!profileDoc.docs.length) {
      return false;
    }

    const { userId } = profileDoc.docs[0].data();
    return userId;
  } 
  catch (error) {
    console.log('>>>> getUserId ERROR', error);
    return false;
  }
}

// POST
const setSchedule = async (req, res) =>{
  try{
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
  } catch (error) {
    console.log('>>>> setSchedule ERROR', error);
    return res.status(401);
  }
}

// GET
const getSchedule = async (req, res) =>{
  try {
    const userId = await getUserId(req.query.username);

    // TODO - VERIFICAR CHAMADAS DUPLICADAS DE getUserId - ESTÁ PASSANDO UNDEFINED
    if (!userId){
      return;
      //return res.status(404).json({message: 'Invalid username'})
    }

    const snapshot = await agenda
      .where('userId', '==', userId)
      .where('date', '==', req.query.date)
      .get();

    const docs = snapshot.docs.map((doc) => doc.data());

    const result = timeBlocksList.map((time) => ({
      time,
      isBlocked: !!docs.find((doc) => doc.time === time), // cast para boolean
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.log('>>>> getSchedule ERROR', error);
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
