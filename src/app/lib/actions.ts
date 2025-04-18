'use server'
 
import { UUID, scryptSync, timingSafeEqual } from "crypto";
import mariadb from "mariadb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  idleTimeout: 60,
});

process.on("SIGINT", async function() {
  await pool.end();
  process.exit();
})

export type timestamp = {
  period: string,
  start: number,
  end: number
}

export type Grupa = {
  grupa: string;
  cilveki: string[];
};


export type Nomin = {
  tips: 'skolenu' | 'skolotaju';
  id: UUID;
  virsraksts: string;
  apraksts: string;
};

export type Finalists = {
  id: UUID;
  cilveki: string[];
}

export type Izvele = {
  nominID: UUID;
  izvele: string;
}

export async function authenticate(_currentState: unknown, formData: FormData) {
  const user = formData.get('code')
  try {
    const dbuser = await checkUser(user as string)
    if (dbuser) {
      if ((user as string).startsWith('admin:')) {
        cookies().set('user', dbuser.cookie as string, {secure: true, httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 1})
        return {success: true, admin: true}
      } else {
        cookies().set('user', user as string, {secure: true, httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 1})
        return {success: true}
      }
    } else {
      return {success: false, message: "Balsošanas kods nepastāv!"}
    }
  } catch (error) {
    console.error(error)
    return {success: false, message: "Datubāzes kļūda!"}
  }
}

export async function checkUser(userID: string) {
  const userCookie = cookies().get('user')
  userID = decodeURIComponent(userID)
  let connection;
  try {
    connection = await pool.getConnection();
    const [user] = await connection.query("SELECT * FROM users WHERE id = ?", [userID]);
    if (userID.startsWith('admin:')) {
      const [admin] = await connection.query("SELECT * FROM users WHERE role = 'admin'");
      const [hashed, salt] = admin.id.replace('admin:', '').split('.');
      const hashedBuf = Buffer.from(hashed, 'hex');
      if (userID.length == 167) {
        const [testHash] = userID.replace('admin:', '').split('.');
        const testBuf = Buffer.from(testHash, 'hex');
        if (timingSafeEqual(hashedBuf, testBuf)) {
          return {admin: true, cookie: `admin:${testBuf.toString('hex')}.${salt}`}
        }
      }
      const testBuf = scryptSync(userID.replace('admin:', ''), salt, 64) as Buffer;
      if (timingSafeEqual(hashedBuf, testBuf)) {
        return {admin: true, cookie: `admin:${testBuf.toString('hex')}.${salt}`}
      }
    }
    if (!user) {
      if (userCookie) {
        redirect('/logout')
      }
      return null
    } else {
      return {nominets: user.nominets, balsots: user.balsots, admin: false}
    }
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    if (connection) connection.end();
  }
}


function processTimestamps() {
    if (!Array.isArray(timestamps)) {
        console.error('timestamps is undefined or not an array');
        return; // This is valid inside the function
    }

    const nominationTimestamp = timestamps.find((timestamp: timestamp) => timestamp.period === "nominacijas");
    const votingTimestamp = timestamps.find((timestamp: timestamp) => timestamp.period === "balsosana");
    // Rest of your logic...
}

// Then call the function when needed
processTimestamps();


export async function checkTime() { 
  let timestamps;
  let connection;
  try {
    connection = await pool.getConnection();
    timestamps = await connection.query("SELECT * FROM timestamps");
  } catch (error) {
    console.error(error)
  } finally {
    if (connection) connection.end();
  }
  const now = new Date();

const nominationTimestamp = timestamps.find((timestamp: timestamp) => timestamp.period == "nominacijas");
const votingTimestamp = timestamps.find((timestamp: timestamp) => timestamp.period == "balsosana");

if (!nominationTimestamp || !votingTimestamp) {
  console.error('Timestamp data is missing');
  return; // Or handle the missing data case
}

if (now < (nominationTimestamp.start ?? Infinity)) {
    return [0, nominationTimestamp.start ?? 0];
} else if (now > (nominationTimestamp.start ?? 0) && now < (nominationTimestamp.end ?? 0)) {
    return [1, nominationTimestamp.end ?? 0];
} else if (now > (nominationTimestamp.end ?? 0) && now < (votingTimestamp.start ?? Infinity)) {
    return [2, votingTimestamp.start ?? 0];
} else if (now > (votingTimestamp.start ?? 0) && now < (votingTimestamp.end ?? 0)) {
    return [3, votingTimestamp.end ?? 0];
}



}

export async function getTimestamps() {
  const response = await fetch('/api/timestamps');
  const yourActualTimestampsArray = await response.json();
  return yourActualTimestampsArray || [];
}


export async function getGrupas(source: string) {
  let grupas: Grupa[] = [];
  let connection;
  try {
    connection = await pool.getConnection();
    const result = (await connection.query(`
      SELECT grupa, GROUP_CONCAT(vards SEPARATOR ',') AS cilveki
      FROM ${source}
      GROUP BY grupa
    `)) as { grupa: string, cilveki: string }[]

    grupas = result.map(({ grupa, cilveki }) => ({ grupa, cilveki: cilveki.split(',') }))

  } catch (error) {
    console.error(error)
  } finally {
    if (connection) connection.end();
  }
  return grupas;
}

export async function getNominacijas() {
  let nominacijas: Nomin[] = [];
  let connection;
  try {
    connection = await pool.getConnection();
    const result = (await connection.query(`
      SELECT *
      FROM nominacijas
    `)) as { tips: 'skolenu'|'skolotaju', id: UUID, virsraksts: string, apraksts: string }[]
    nominacijas = result
  } catch (error) {
    console.error(error)
  } finally {
    if (connection) connection.end();
  }
  return nominacijas;
}

export async function getFinalists() {
  let finalists: Finalists[] = [];
  let connection;
  try {
    connection = await pool.getConnection();
    const result = (await connection.query(`
      SELECT nominID, GROUP_CONCAT(vards SEPARATOR ';') as cilveki
      FROM finalists
      GROUP BY nominID
    `)) as { nominID: UUID, cilveki: string }[]
    finalists = result.map(({ nominID: id, cilveki }) => ({ id, cilveki: cilveki.split(';') }))
  } catch (error) {
    console.error(error)
  } finally {
    if (connection) connection.end();
  }
  return finalists;
}

export async function submitForm(_currentState: unknown, formData: FormData) {
  const period = await checkTime()
  const user = cookies().get('user')?.value
  let dbuser;
  
  if (user) {
    dbuser = await checkUser(user as string)
    if (!dbuser) {
      redirect('/login')
    }
  } else {
    redirect('/login')
  }

  if (period[0] == 1 && dbuser.nominets || period[0] == 3 && dbuser.balsots) {
    return {success: false, message: `Ar šo kodu jau vienreiz ${period[0] == 1 ? 'nominēts' : 'balsots'}!`}

  }
  
  const votes = Array.from(formData.entries())
  while (votes[0][0].startsWith('$')) {
    votes.shift()
    if (votes.length < 1) {
      return {success: false, message: "Nepieciešams balsot par vismaz vienu nomināciju!"}
    }
  }
  
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(`
      UPDATE users
      SET ${period[0] == 1 ? 'nominets' : period[0] == 3 && 'balsots'} = 1
      WHERE id = ?
    `, [user])
    for (const entry of votes) {
      await connection.query(`
        INSERT INTO ${period[0] == 1 ? 'karta1' : period[0] == 3 && 'karta2'}
        VALUES (?, ?, ?)
      `, [user, entry[0], entry[1]])
    }
    return {success: true, message: "Balsošana veiksmīga!"}
  } catch (error) {
    console.error(error)
    return {success: false, message: "Datubāzes kļūda!"}
  } finally {
    if (connection) connection.end();
  }
}

export async function getChoices(period: number) {
  const user = cookies().get('user')?.value
  let dbuser;
  
  if (user) {
    dbuser = await checkUser(user as string)
    if (!dbuser) {
      redirect('/login')
    }
  } else {
    redirect('/login')
  }

  let choices: Izvele[] = [];

  let connection;
  try {
    connection = await pool.getConnection();
    const result = (await connection.query(`
      SELECT nominID, izvele
      FROM ${period == 1 ? 'karta1' : period == 3 && 'karta2'}
      WHERE userID = ?
    `, [user])) as Izvele[]
    choices = result
  } catch (error) {
    console.error(error)
  } finally {
    if (connection) connection.end();
  }
  return choices
}

console.log(timestamps); // This will print the timestamps array to the console
