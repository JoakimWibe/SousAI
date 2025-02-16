"use client"

import { useUser } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type ApiResponse = {
    message: string,
    error?: string,
};

async function createAccountRequest() {
    const response = await fetch('/api/create-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    return data as ApiResponse;
}

export default function CreateAccount() {
    const router = useRouter();
    const {isLoaded, isSignedIn} = useUser()
    const { mutate, isPending } = useMutation<ApiResponse, Error>({
        mutationFn: createAccountRequest,
        onSuccess: () => {
            router.push('/meal-planner')
        },
        onError: (err) => {
            console.log(err);
        }
    });

    useEffect(() => {
        if(isLoaded && isSignedIn && !isPending) {
            mutate()
        }
    }, [isLoaded, isSignedIn])

    return <div>Signing in...</div>
}