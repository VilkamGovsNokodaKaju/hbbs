import React from 'react'
import ReactDOM from 'react-dom/client'
import Balss from './components/balss'
import 'bootstrap/dist/css/bootstrap.min.css'
import { mongoContext, nominContext, stampContext } from './components/contextProvider'
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
const stamps = await sistema.findOne({type: 'stamps'})
const nominacijas = await sistema.findOne({type: 'nominacijas'})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <mongoContext.Provider value={mongo}>
      <stampContext.Provider value={stamps}>
        <nominContext.Provider value={nominacijas}>
          <Balss />
        </nominContext.Provider>
      </stampContext.Provider>
    </mongoContext.Provider>
  </React.StrictMode>
)
