import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('email, is_active')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { success: false, error: 'This email is already subscribed!' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        const { error } = await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true, subscribed_at: new Date().toISOString() })
          .eq('email', email.toLowerCase());

        if (error) {
          console.error('Reactivation error:', error);
          return NextResponse.json(
            { success: false, error: 'Failed to reactivate subscription' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.'
        });
      }
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        source: 'insider-weekly'
      });

    if (error) {
      console.error('Subscription error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your inbox for a welcome email.'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
