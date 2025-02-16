import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <main className='flex justify-center items-center h-screen w-full'>
            <SignUp signInFallbackRedirectUrl={'/create-account'} />
        </main>
    )
}