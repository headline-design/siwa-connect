import { NextResponse } from 'next/server'
import { SiwaMessage } from '@avmkit/siwa'

export async function POST(req: Request) {
  const body = await req.json()
  const { message, signature, address } = body

  try {
    const siwaMessage = new SiwaMessage(message)
    const isValid = await siwaMessage.verify({
      signature,
      address,
    })

    if (isValid) {
      // In a real application, you would create a session or JWT here
      return NextResponse.json({ success: true, message: "Signature verified successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying signature:", error)
    return NextResponse.json({ success: false, message: "Error verifying signature" }, { status: 500 })
  }
}

