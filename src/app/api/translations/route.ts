import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

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

export async function POST(request: Request) {
  try {
    const { locale, scope, translations } = await request.json();

    if (!locale || !scope || !translations) {
      return NextResponse.json(
        {
          error: 'Missing locale, scope, or translations in the request body.',
        },
        { status: 400 }
      );
    }

    const data = readJSONFile(locale);

    if (!data[scope]) {
      data[scope] = {};
    }

    for (const [key, value] of Object.entries(translations)) {
      data[scope][key] = value;
    }

    writeJSONFile(locale, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving translations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
