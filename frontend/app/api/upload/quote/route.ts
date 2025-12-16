import {NextResponse} from 'next/server'
import {serverClient} from '@/sanity/lib/serverClient'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  try {
    const body = await req.json()

    const recaptchaToken = body.recaptcha

    if (!recaptchaToken) {
        return NextResponse.json({error: 'Missing reCAPTCHA'}, {status: 400})
    }

    const verifyRes = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`,
    }
    )

    const result = await verifyRes.json()

    if (!result.success || result.score < 0.5) {
    return NextResponse.json(
        {error: 'Bot detected'},
        {status: 403}
    )
    }

    await serverClient.create({
      _type: 'quote',
      text: body.text,
      author: body.author || undefined,
      uploadedAt: new Date().toISOString(),
      ...(body.coordinates && {coordinates: body.coordinates}),
    })

    return NextResponse.json({success: true})
  } catch (err) {
    console.error(err)
    return NextResponse.json({error: 'Upload failed'}, {status: 500})
  }
}
