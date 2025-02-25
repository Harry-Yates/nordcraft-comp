'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function ConfirmPage() {
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
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 text-center">
                <h1 className="text-2xl font-bold">Email Confirmation</h1>

                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <p className="text-green-500">{message}</p>
                )}
            </div>
        </div>
    );
} 