import Login from "../components/login"
import * as Realm from "realm-web";
import Dashboard from "../components/dash";
import { useState } from "react";

const realmApp = "hbbs-ntiaq"
const app = new Realm.App({ id: realmApp });

export default function Admin() {
    const [validSession, setSession] = useState(false)

    if (validSession) {
        return (
            <Dashboard app={app} />
        )
    } else {
        return (
            <Login setSession={setSession} type="admin" />
        )
    }
}

export {app}