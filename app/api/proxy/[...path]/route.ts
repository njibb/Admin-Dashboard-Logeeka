import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = req.nextUrl.search;
  
  // Menggabungkan path jadi URL (contoh: admin/berita/show/id)
  const fullPath = path.join('/');
  
  try {
    const finalUrl = `${baseUrl}/api/${fullPath}${searchParams}`;
    
    // Server Next.js yang nembak API, jadi CORS gak bakal kena
    const response = await axios.get(finalUrl, {
      headers: { 
        'Authorization': req.headers.get('Authorization') || '',
        'Accept': 'application/json'
      }
    });
    return NextResponse.json(response.data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: error.response?.status || 500 }
    );
  }
}