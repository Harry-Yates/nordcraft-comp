'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/utils/supabase';

export default function HomePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // First check if the email already exists
      const { data: existingAttendee } = await supabase
        .from('attendees')
        .select('confirmed')
        .eq('email', email)
        .single();

      if (existingAttendee) {
        if (existingAttendee.confirmed) {
          throw new Error('This email has already been registered and confirmed.');
        } else {
          // If email exists but not confirmed, send another magic link
          const { error: authError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: new URL('/confirm', process.env.NEXT_PUBLIC_SITE_URL).toString(),
              data: {
                name: name
              }
            }
          });

          if (authError) {
            throw new Error(`Error sending magic link: ${authError.message}`);
          }

          setMessage('A new confirmation email has been sent. Please check your inbox.');
          setName('');
          setEmail('');
          return;
        }
      }

      // Insert new attendee
      const { error: attendeeError } = await supabase
        .from('attendees')
        .insert([{ name, email, confirmed: false }]);

      if (attendeeError) {
        throw new Error(`Error registering: ${attendeeError.message}`);
      }

      // Send magic link email
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: new URL('/confirm', process.env.NEXT_PUBLIC_SITE_URL).toString(),
          data: {
            name: name
          }
        }
      });

      if (authError) {
        throw new Error(`Error sending magic link: ${authError.message}`);
      }

      setMessage('Please check your email for the magic link!');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Signup error:', error);
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to Nordcraft</h1>
          <p className="mt-2 text-xl text-gray-600">Register now for the chance to win a watch!</p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register Now'}
          </Button>
        </form>

        {message && (
          <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
