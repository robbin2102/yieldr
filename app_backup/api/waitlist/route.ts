// app/api/waitlist/route.ts
import { NextResponse } from 'next/server';

// For now, we'll store emails in memory (we'll add MongoDB after deployment)
const waitlist: string[] = [];

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Basic validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Please provide a valid email' },
        { status: 400 }
      );
    }
    
    // Check if already exists
    if (waitlist.includes(email)) {
      return NextResponse.json(
        { message: 'You\'re already on the waitlist!' },
        { status: 400 }
      );
    }
    
    // Add to waitlist
    waitlist.push(email);
    console.log(`New waitlist signup: ${email} | Total: ${waitlist.length}`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully joined waitlist',
      position: waitlist.length 
    });
    
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}