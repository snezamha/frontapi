import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { locales } from '@/config/locales';

function getLocalesDir() {
  return path.join(process.cwd(), 'src', 'messages');
}

function readJSONFile(locale: string) {
  const filePath = path.join(getLocalesDir(), `${locale}.json`);
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return {};
  }
}

function writeJSONFile(locale: string, content: Record<string, unknown>) {
  const filePath = path.join(getLocalesDir(), `${locale}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
}

export async function GET() {
  const enData = readJSONFile('en');
  const faData = readJSONFile('fa');
  const deData = readJSONFile('de');

  const enScopes = Object.keys(enData);
  const faScopes = Object.keys(faData);
  const deScopes = Object.keys(deData);

  const allScopes = Array.from(
    new Set([...enScopes, ...faScopes, ...deScopes])
  );

  return NextResponse.json(allScopes);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get('scope');

  if (!scope) {
    return NextResponse.json(
      { error: 'Missing "scope" parameter' },
      { status: 400 }
    );
  }

  for (const locale of locales) {
    const data = readJSONFile(locale);
    if (data[scope] !== undefined) {
      delete data[scope];
      writeJSONFile(locale, data);
    }
  }

  return NextResponse.json({ success: true });
}
