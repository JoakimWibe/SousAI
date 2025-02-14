import { Button } from '@/components/ui/button';
import { Check, Cog, UserPlus } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    id: 1,
    icon: <UserPlus />,
    title: "Create an account",
    description: "Sign up or sign in to access your personalized meal plan."
  },
  {
    id: 2,
    icon: <Cog />,
    title: "Set your preferences",
    description: "Input your dietary goals and preferences to tailor your meal plans."
  },
  {
    id: 3,
    icon: <Check />,
    title: "Recieve your meal plan",
    description: "Get your customized plan delivered weekly to your account."
  }
]

export default function HomePage() {
  return (
    <main className='min-h-screen flex flex-col items-center pt-32 w-full gap-10'>
      <section className='border h-[300px] md:w-5/6 px-8 rounded-md flex flex-col items-center justify-center text-center gap-4'>
        <h1 className='font-bold text-2xl md:text-3xl'>Personalized AI Meal Plans</h1>  
        <p>Let the AI do the planning. You focus on what you enjoy!</p>
        <Link href='/sign-up'>
          <Button>Get started</Button>
        </Link>
      </section>

      <section className='md:w-5/6 text-center m-4'>
        <h2 className='mb-2 text-2xl font-bold'>How it works</h2>
        <p>Follow these simple steps to get your personalized meal plan.</p>
        <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {steps.map((step) => (
          <div className='border text-center rounded-md p-8 flex flex-col items-center gap-4' key={step.id}>
            {step.icon}
            <h3 className='font-bold text-xl'>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
        </div>
      </section>
    </main>
  );
}
