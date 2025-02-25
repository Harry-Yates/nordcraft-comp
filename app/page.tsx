'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/utils/supabase';
import Image from 'next/image';

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
            if (authError.message.includes('rate limit exceeded')) {
              throw new Error('You\'ve requested too many login emails. Please wait 1 hour before trying again, or check your email for an existing magic link.');
            }
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
        if (attendeeError.message.includes('duplicate key value violates unique constraint')) {
          throw new Error('This email address has already been registered. Please use a different email address or check your inbox for the confirmation email.');
        }
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
        if (authError.message.includes('rate limit exceeded')) {
          throw new Error('You\'ve requested too many login emails. Please wait 1 hour before trying again, or check your email for an existing magic link.');
        }
        throw new Error(`Error sending magic link: ${authError.message}`);
      }

      setMessage('Please check your email for the magic link!');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setMessage(errorMessage);

      // Clear the form only if it's not a rate limit error
      if (!errorMessage.includes('rate limit exceeded')) {
        setName('');
        setEmail('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start p-4 bg-gradient-to-br from-[#071526] via-[#0A192F] to-[#071526] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/10 via-[#1E40AF]/10 to-[#2563EB]/10 animate-gradient"></div>

      {/* Logo */}
      <div className="relative z-10 w-full max-w-lg mx-auto mt-4 sm:mt-8 mb-4 sm:mb-6 px-4 transform hover:scale-102 transition-transform duration-300">
        <Image
          src="/images/Nordcraft-horizontal.png"
          alt="Nordcraft Logo"
          width={400}
          height={133}
          className="w-full h-auto drop-shadow-2xl"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md space-y-4 sm:space-y-6 px-4">
        <div className="text-center space-y-3 sm:space-y-4 animate-fade-in">
          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Welcome
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 font-light">
            Register now for the chance to win a <span className="font-semibold text-white">Garmin watch!</span>
          </p>
        </div>

        <form onSubmit={handleSignup} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 bg-[#112240]/40 backdrop-blur-xl p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl border border-[#1E3A8A]/30 transform hover:scale-[1.01] transition-all duration-300">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white text-base sm:text-lg font-medium pl-1">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 sm:h-12 bg-[#0A192F]/60 border-[#1E3A8A]/30 text-white text-base sm:text-lg placeholder:text-gray-400 focus:bg-[#112240]/80 focus:border-[#1E3A8A]/50 transition-all duration-300 rounded-lg sm:rounded-xl shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-base sm:text-lg font-medium pl-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 sm:h-12 bg-[#0A192F]/60 border-[#1E3A8A]/30 text-white text-base sm:text-lg placeholder:text-gray-400 focus:bg-[#112240]/80 focus:border-[#1E3A8A]/50 transition-all duration-300 rounded-lg sm:rounded-xl shadow-inner"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 sm:h-12 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-base sm:text-lg font-medium rounded-lg sm:rounded-xl shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ring-1 ring-white/10 hover:ring-white/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 sm:w-5 h-4 sm:h-5 border-t-2 border-white rounded-full animate-spin"></div>
                <span>Registering...</span>
              </div>
            ) : (
              'Register Now'
            )}
          </Button>
        </form>

        {message && (
          <div className="mt-4 sm:mt-6 p-4 rounded-lg sm:rounded-xl bg-[#112240]/40 backdrop-blur-sm border border-[#1E3A8A]/30 transform hover:scale-[1.02] transition-all duration-300">
            <p className={`text-center text-base sm:text-lg ${message.includes('Error') ? 'text-red-300' : 'text-emerald-300'} font-medium`}>
              {message}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto py-4 sm:py-6 text-center text-[#94A3B8] text-xs sm:text-sm font-light px-4">
        <p>© 2024 Nordcraft. All rights reserved.</p>
      </div>
    </div>
  );
}
