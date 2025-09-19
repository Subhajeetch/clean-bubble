'use client';


import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';




function CallbackPage() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (code) {
            try {
                await navigator.clipboard.writeText(code);
                setCopied(true);
                toast.success('Code copied to clipboard!');
            } catch (err) {
                toast.error('Failed to copy code');
            }
        }
    };

    return (
        <div className='p-4 h-screen flex flex-col items-center justify-center'>
            <h1>Callback Page</h1>
            <div className='flex items-center gap-2 mt-4'>
                <p>Code: {code ? <span className="font-mono bg-muted px-2 py-1 rounded">{code}</span> : 'No code parameter found'}</p>
                {code && (
                    <Button size="sm" onClick={handleCopy} type="button">
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function CallbackPageWrapper() {
    return (
        <Suspense fallback={<div className="p-4 h-screen flex items-center justify-center">Loading...</div>}>
            <CallbackPage />
        </Suspense>
    );
}

