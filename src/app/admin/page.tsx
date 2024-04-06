import { getElite, getNominatedAmount, getTimestamps, getTop5, getVotedAmount, getVoterAmount } from "@/app/lib/admin-actions";
import { checkUser, getNominacijas } from "@/app/lib/actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import FinalTable from "@/_components/tables/final-table";
import EliteTable from "@/_components/tables/elite-table";
import TableSwitcher from "@/_components/tables/table-switcher";

const NominTable = dynamic(() => import("@/_components/tables/nomin-table"), { loading: () => <div className="loading loading-bars"></div> })

const ChangePassword = dynamic(() => import("@/_components/admin/password"), { loading: () => <div className="loading loading-bars"></div> })
const FileUpload = dynamic(() => import("@/_components/admin/file-upload"), { loading: () => <div className="loading loading-bars"></div> })
const Timestamps = dynamic(() => import("@/_components/admin/timestamps"), { loading: () => <div className="loading loading-bars"></div> })
const Delete = dynamic(() => import("@/_components/admin/delete"), { loading: () => <div className="loading loading-bars"></div> })
const CodeGenerator = dynamic(() => import("@/_components/admin/code-generator"), { loading: () => <div className="loading loading-bars"></div> })

export default async function Admin() {
    const user = cookies().get('user')?.value
    let dbuser;
    if (user) {
      dbuser = await checkUser(user)
      if (!dbuser || !dbuser.admin) {
        redirect('/login')
      }
    } else {
      redirect('/login')
    }

    const voterAmountData = getVoterAmount();
    const nominatedAmountData = getNominatedAmount();
    const votedAmountData = getVotedAmount();
    const nominacijasData = getNominacijas();
    const top5Data = getTop5();
    const eliteData = getElite();
    const timestampsData = getTimestamps();

    const [voterAmount, nominatedAmount, votedAmount, nominacijas, top5, elite, timestamps] = await Promise.all([voterAmountData, nominatedAmountData, votedAmountData, nominacijasData, top5Data, eliteData, timestampsData]);

    const finalTabulas = nominacijas.map(n => {
        return <FinalTable key={n.id} id={n.id} title={n.virsraksts} list={top5.find(t => t.nominID == n.id)?.top_izveles || []} />
    })

    const eliteTabulas = nominacijas.map(n => {
        return <EliteTable key={n.id} title={n.virsraksts} list={elite.find(e => e.nominID == n.id)?.top_izveles || []} />
    })

    return (
        <div className="p-0 md:p-3 flex flex-wrap justify-around gap-5">
            <div className="card">
                <div className="card-body join join-vertical items-center p-4 md:p-8">
                    <div className="radial-progress text-base mb-2" style={{"--value": nominatedAmount/voterAmount*100} as React.CSSProperties}>{`${nominatedAmount}/${voterAmount}`}</div>
                    <p className="text-center">Nominējušo skaits</p>
                </div>
            </div>
            <div className="card">
                <div className="card-body join join-vertical items-center p-4 md:p-8">
                    <div className="radial-progress text-base mb-2" style={{"--value": votedAmount/nominatedAmount*100} as React.CSSProperties}>{`${votedAmount}/${nominatedAmount}`}</div>
                    <p className="text-center">Balsojušo skaits</p>
                </div>
            </div>
            <div className="card">
                <div className="card-body min-w-min p-4 md:p-8">
                    <p className="text-2xl self-center">Finālistu izvēle</p>
                    <TableSwitcher>
                        {finalTabulas}
                    </TableSwitcher>
                </div>
            </div>
            <div className="card">
                <div className="card-body min-w-min p-4 md:p-8">
                    <p className="text-2xl self-center grow-0">Hāgena balvas ieguvēji</p>
                    <TableSwitcher>
                        {eliteTabulas}
                    </TableSwitcher>
                </div>
            </div>
            <ChangePassword />
            <FileUpload type={0} />
            <FileUpload type={1} />
            <Timestamps stamps={timestamps} />
            <div className="card">
                <div className="card-body p-4 md:p-8">
                    <p className="text-2xl self-center grow-0">Skolēnu nominācijas</p>
                    <NominTable type="skolenu" list={nominacijas} />
                </div>
            </div>
            <div className="card">
                <div className="card-body p-4 md:p-8">
                    <p className="text-2xl self-center grow-0">Skolotāju nominācijas</p>
                    <NominTable type="skolotaju" list={nominacijas} />
                </div>
            </div>
            <CodeGenerator />
            <Delete />
        </div>
    )
}
