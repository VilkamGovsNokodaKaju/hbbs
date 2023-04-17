import Login from "../components/login"
import * as Realm from "realm-web";
import ChartDashboard from "../components/chartDash";
import { useState } from "react";
import Dashboard from "../components/dash";

const realmApp = "hbbs-ntiaq"
const app = new Realm.App({ id: realmApp });

export default function Admin() {
    const [validSession, setSession] = useState(false)

    if (validSession) {
        return (
            <div>
                <ChartDashboard app={app} />
                <Dashboard />
            </div>
        )
    } else {
        return (
            <Login setSession={setSession} type="admin" />
        )
    }
}

export {app}