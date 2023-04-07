import React from 'react'
import ReactDOM from 'react-dom/client'
import Balss from './components/balss'
import 'bootstrap/dist/css/bootstrap.min.css'
import { balssContext, klasContext, nominContext, skolotContext, stampContext } from './components/contextProvider'
import * as Realm from "realm-web";

const realmApp = "hbbs-ntiaq"
const mongoCluster = "mongodb-atlas"

const app = new Realm.App({ id: realmApp });
const credentials = Realm.Credentials.anonymous();
try {
  const user = await app.logIn(credentials);
} catch(err) {
  console.error("Failed to log in", err);
}

const mongo = app.currentUser.mongoClient(mongoCluster);
const sistema = mongo.db('data').collection('sistema')
const sistemasDati = await sistema.find()
const stamps = sistemasDati.find(doc => doc._id === 'stamps')
const nominacijas = sistemasDati.find(doc => doc._id === 'nominacijas')
const klases = sistemasDati.find(doc => doc._id === 'klases')
const skolotaji = sistemasDati.find(doc => doc._id === 'skolotaji')
const balsis = mongo.db('data').collection('balsis')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <stampContext.Provider value={stamps}>
      <nominContext.Provider value={nominacijas}>
        <klasContext.Provider value={klases.list}>
          <skolotContext.Provider value={skolotaji.list}>
              <Balss />
          </skolotContext.Provider>
        </klasContext.Provider>
      </nominContext.Provider>
    </stampContext.Provider>
  </React.StrictMode>
)

export { app }