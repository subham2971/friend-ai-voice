import { NextResponse } from 'next/server';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request){
  const form = await req.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ ok:false, error:'no_file' }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);
  const dir = process.env.DATA_DIR || (process.env.NODE_ENV === 'production' ? '/tmp' : join(process.cwd(), '.data'));
  const filename = `voice_${randomUUID()}.bin`;
  const path = join(dir, filename);
  await writeFile(path, buf);
  return NextResponse.json({ ok:true, path });
}
