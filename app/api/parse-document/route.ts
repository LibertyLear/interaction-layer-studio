import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse.js';
// @ts-ignore
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    let text = '';

    if (extension === 'pdf') {
      // Parse PDF
      const data = await pdf(buffer);
      text = data.text;
    } else if (extension === 'docx' || extension === 'doc') {
      // Parse Word document
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Document parsing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse document' },
      { status: 500 }
    );
  }
}
