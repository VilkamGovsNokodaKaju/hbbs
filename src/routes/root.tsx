import { useEffect, useState } from 'react';
import Balss from '../components/balss'
import { balssContext, klasContext, nominContext, skolotContext, stampContext } from '../components/contextProvider'
import * as Realm from "realm-web";

const realmApp = "hbbs-ntiaq"
const mongoCluster = "mongodb-atlas"

const app = new Realm.App({ id: realmApp });

async function dataFetch() {
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
    const balssDati = await balsis.find()

    return {stamps, nominacijas, klases, skolotaji, balssDati}
}

export default function Root() {
    const [stamps, setStamps] = useState(null)
    const [nominacijas, setNominacijas] = useState(null)
    const [klases, setKlases] = useState(null)
    const [skolotaji, setSkolotaji] = useState(null)
    const [balssDati, setBalsis] = useState(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        dataFetch().then(({stamps, nominacijas, klases, skolotaji, balssDati}) => {
            setStamps(stamps)
            setNominacijas(nominacijas)
            setKlases(klases.list)
            setSkolotaji(skolotaji.list)
            setBalsis(balssDati)
            setReady(true)
        })
    })

    if (ready) {
        return (
            <stampContext.Provider value={stamps}>
                <nominContext.Provider value={nominacijas}>
                    <klasContext.Provider value={klases}>
                        <skolotContext.Provider value={skolotaji}>
                            <balssContext.Provider value={balssDati}>
                                <Balss />
                            </balssContext.Provider>
                        </skolotContext.Provider>
                    </klasContext.Provider>
                </nominContext.Provider>
            </stampContext.Provider>
        )
    } else {
        <></>
    }
}

export { app }