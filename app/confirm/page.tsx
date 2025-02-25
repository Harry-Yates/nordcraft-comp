'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import Image from 'next/image';

// Create a client component that uses useSearchParams
function ConfirmContent() {
    const [message, setMessage] = useState('Verifying your email...');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            try {
                // Log URL and hash for debugging
                console.log('Current URL:', window.location.href);
                console.log('Hash:', window.location.hash);
                console.log('Search:', window.location.search);
                console.log('URL Parameters:', Object.fromEntries(searchParams.entries()));

                // First try to recover the session from the URL
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session error:', sessionError);
                    throw sessionError;
                }

                if (!session) {
                    // If no session, try to get it from the hash fragment
                    const hashParams = new URLSearchParams(window.location.hash.substring(1));
                    console.log('Hash params:', Object.fromEntries(hashParams.entries()));

                    if (hashParams.has('access_token')) {
                        const { error: setSessionError } = await supabase.auth.setSession({
                            access_token: hashParams.get('access_token')!,
                            refresh_token: hashParams.get('refresh_token')!
                        });

                        if (setSessionError) {
                            console.error('Set session error:', setSessionError);
                            throw setSessionError;
                        }
                    } else {
                        throw new Error('No authentication data found');
                    }
                }

                // Get the authenticated user
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.error('User error:', userError);
                    throw new Error('Could not get user details');
                }

                console.log('User found:', user.email);

                // Update the attendee record to mark as confirmed
                const { error: updateError } = await supabase
                    .from('attendees')
                    .update({ confirmed: true })
                    .eq('email', user.email)
                    .select();

                if (updateError) {
                    console.error('Update error:', updateError);
                    throw new Error(`Error updating confirmation: ${updateError.message}`);
                }

                setMessage('Your email has been confirmed. Thank you for registering!');

                // Redirect to home page after 3 seconds
                setTimeout(() => {
                    router.push('/');
                }, 3000);

            } catch (error) {
                console.error('Confirmation error:', error);
                setError(error instanceof Error ? error.message : 'An error occurred');
            }
        };

        handleEmailConfirmation();
    }, [router, searchParams]);

    return (
        <div className="relative z-10 w-full max-w-md space-y-4 sm:space-y-6 px-4">
            <div className="text-center space-y-3 sm:space-y-4 animate-fade-in">
                <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                    Confirming
                </h1>
            </div>

            <div className="mt-6 sm:mt-8 p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-[#112240]/40 backdrop-blur-xl shadow-2xl border border-[#1E3A8A]/30">
                {error ? (
                    <div className="flex flex-col items-center space-y-4">
                        <p className="text-red-300 text-base sm:text-lg text-center font-medium">{error}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 h-11 sm:h-12 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-base sm:text-lg font-medium rounded-lg sm:rounded-xl shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 ring-1 ring-white/10 hover:ring-white/20"
                        >
                            Return Home
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin mb-4"></div>
                        <p className="text-emerald-300 text-base sm:text-lg text-center font-medium">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Main page component with Suspense boundary
export default function ConfirmPage() {
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

            <Suspense fallback={
                <div className="relative z-10 w-full max-w-md space-y-4 sm:space-y-6 px-4">
                    <div className="text-center space-y-3 sm:space-y-4">
                        <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                            Loading
                        </h1>
                    </div>
                    <div className="mt-6 sm:mt-8 p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-[#112240]/40 backdrop-blur-xl shadow-2xl border border-[#1E3A8A]/30">
                        <div className="flex flex-col items-center">
                            <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
                        </div>
                    </div>
                </div>
            }>
                <ConfirmContent />
            </Suspense>

            {/* Footer */}
            <div className="relative z-10 mt-auto py-4 sm:py-6 text-center text-[#94A3B8] text-xs sm:text-sm font-light px-4">
                <p>© 2024 Nordcraft. All rights reserved.</p>
            </div>
        </div>
    );
} 