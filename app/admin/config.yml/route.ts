import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const configPath = join(process.cwd(), 'public', 'admin', 'config.yml')
    const configContent = readFileSync(configPath, 'utf-8')
    
    return new NextResponse(configContent, {
      headers: {
        'Content-Type': 'text/yaml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error reading config.yml:', error)
    return new NextResponse('Config file not found', { status: 404 })
  }
}

