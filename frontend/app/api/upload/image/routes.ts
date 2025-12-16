import {NextResponse} from 'next/server'
import {serverClient} from '@/sanity/lib/serverClient'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  try {
    const formData = await req.formData()
    const recaptchaToken = formData.get('recaptcha')

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

    const file = formData.get('file') as File
    const caption = formData.get('caption') as string | null
    const coordinates = formData.get('coordinates') as string | null

    if (!file) {
      return NextResponse.json({error: 'No file'}, {status: 400})
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const asset = await serverClient.assets.upload('image', buffer, {
      filename: file.name,
    })

    await serverClient.create({
      _type: 'imageUpload',
      image: {
        _type: 'image',
        asset: {_type: 'reference', _ref: asset._id},
      },
      caption,
      uploadedAt: new Date().toISOString(),
      ...(coordinates && {coordinates: JSON.parse(coordinates)}),
    })

    return NextResponse.json({success: true})
  } catch (err) {
    console.error(err)
    return NextResponse.json({error: 'Upload failed'}, {status: 500})
  }
}
