import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug.join('/')
  const { search } = new URL(request.url)
  const url = `${process.env.BACKEND_URL}/${slug}${search}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization') || '',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Backend error: ${response.status} ${errorText}`)
      return new NextResponse(errorText, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Proxy error: ${error}`)
    return new NextResponse('Proxy error', { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug.join('/')
  const { search } = new URL(request.url)
  const url = `${process.env.BACKEND_URL}/${slug}${search}`
  const body = await request.json()

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Backend error: ${response.status} ${errorText}`)
      return new NextResponse(errorText, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Proxy error: ${error}`)
    return new NextResponse('Proxy error', { status: 500 })
  }
}
