import fs from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

function getLocalesDir() {
  return path.join(process.cwd(), 'src', 'messages');
}

async function readJSONFile(locale: string) {
  const filePath = path.join(getLocalesDir(), `${locale}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return {};
  }
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params;

  const locale = params.locale;

  const data = await readJSONFile(locale);
  return NextResponse.json(data);
}
