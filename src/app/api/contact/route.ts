import { NextResponse } from 'next/server';
import axios from 'axios';

// Get Pushbullet auth token from environment variables
const PUSHBULLET_TOKEN = process.env.PUSHBULLET_TOKEN;

export async function POST(request: Request) {
  try {
    // Check if token is configured
    if (!PUSHBULLET_TOKEN) {
      console.error('Pushbullet token not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse the form data from request
    const formData = await request.json();
    const { name, email, message } = formData;

    // Validate form data
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send notification via Pushbullet
    const response = await axios.post(
      'https://api.pushbullet.com/v2/pushes',
      {
        type: 'note',
        title: `Contact Form: ${name}`,
        body: `From: ${name} (${email})\n\nMessage: ${message}`,
      },
      {
        headers: {
          'Access-Token': PUSHBULLET_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to send Pushbullet notification');
    }

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending contact form notification:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send message',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 