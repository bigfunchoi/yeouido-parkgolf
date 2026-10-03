import { neon } from '@neondatabase/serverless';

const PEOPLE = ['장선순','진도홍','이미경','박인규','오정화','김성규','박윤경','조성완','김미숙','임임환','이애자','노재돈'];
const STATUSES = new Set(['참석','불참','미정']);

function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL이 설정되지 않았습니다. Vercel에서 Neon 데이터베이스를 연결해 주세요.');
  return neon(process.env.DATABASE_URL);
}

async function init(sql) {
  await sql`CREATE TABLE IF NOT EXISTS attendance (
    date DATE NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (date, name)
  )`;
}

function validDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value || ''); }

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const sql = db();
    await init(sql);

    if (req.method === 'GET') {
      const date = req.query?.date;
      if (!validDate(date)) return res.status(400).json({error:'날짜 형식이 올바르지 않습니다.'});
      const rows = await sql`SELECT name, status FROM attendance WHERE date = ${date}`;
      const data = Object.fromEntries(PEOPLE.map(p => [p, '미정']));
      for (const row of rows) if (PEOPLE.includes(row.name) && row.status) data[row.name] = row.status;
      return res.status(200).json({date, people: PEOPLE, attendance: data});
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const date = body?.date, name = body?.name, status = body?.status;
      if (!validDate(date) || !PEOPLE.includes(name) || !STATUSES.has(status)) {
        return res.status(400).json({error:'입력값을 확인해 주세요.'});
      }
      await sql`INSERT INTO attendance (date, name, status)
        VALUES (${date}, ${name}, ${status})
        ON CONFLICT (date, name)
        DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()`;
      return res.status(200).json({ok:true});
    }

    return res.status(405).json({error:'허용되지 않는 요청입니다.'});
  } catch (e) {
    console.error(e);
    return res.status(500).json({error: e.message || '서버 오류가 발생했습니다.'});
  }
}
