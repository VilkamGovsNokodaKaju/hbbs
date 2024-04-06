import IzveleList from "@/_components/izvele";
import { Finalists, Grupa, checkTime, checkUser, getChoices, getFinalists, getGrupas, getNominacijas } from "@/app/lib/actions";
import dynamicImport from "next/dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Timer = dynamicImport(() => import("@/_components/timer"), { ssr: false, loading: () => <div className="loading loading-bars"></div> })
const VotingForm = dynamicImport(() => import("@/_components/veidlapa"), { loading: () => <div className="loading loading-bars"></div> })

export const dynamic = "force-dynamic"

export default async function Home() {
  const [period, endTime] = await checkTime()
  if (period == 0 || period == 2 || period == 4) {
    return (
      <div className="flex items-center justify-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 join join-vertical">
        {period == 0 && <p className="text-2xl text-center">Nominēšana būs pieejama pēc:</p>}
        {period == 2 && <p className="text-2xl text-center">Balsošana būs pieejama pēc:</p>}
        {period == 4 ? <p className="text-4xl font-bold text-center">Balsošana ir noslēgusies!</p> : <Timer endTime={endTime} small={false} />}
      </div>
    )
  } else {
    const user = cookies().get('user')?.value
    let dbuser;
    if (user) {
      dbuser = await checkUser(user)
      if (!dbuser) {
        redirect('/login')
      }
    } else {
      redirect('/login')
    }

    const nominacijas = await getNominacijas()
    let skoleni: Grupa[] = []
    let skolotaji: Grupa[] = []
    let finals: Finalists[] = []
    if (period == 1) {
      skoleni = await getGrupas("skoleni")
      skolotaji = await getGrupas("skolotaji")
    } else {
      finals = await getFinalists()
    }

    const izveles = await getChoices(period)
    return (
      <div className='p-3'>
        <div className="max-w-2xl mx-auto" >
          <p className="mb-2 text-center">{period == 1 && 'Nominēšana'}{period == 3 && 'Balsošana'} noslēgsies pēc:</p>
          <div className="flex items-center justify-center mb-5">
            <Timer endTime={endTime} small={true} />
          </div>
          {period == 1 && dbuser.nominets || period ===3 && dbuser.balsots ?
            <IzveleList nominacijas={nominacijas} izveles={izveles} />
          :
            <VotingForm skoleni={skoleni} skolotaji={skolotaji} nominacijas={nominacijas} period={period} finalList={finals} />
          }
        </div>
      </div>
    )
  }
}
