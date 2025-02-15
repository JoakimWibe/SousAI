import { Button } from '@/components/ui/button';
import { Check, Cog, UserPlus, ChefHat } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    id: 1,
    icon: <UserPlus className="w-6 h-6 text-primary" />,
    title: "Quick Sign Up",
    description: "Get started in seconds - no complex forms, just smart meal planning at your fingertips."
  },
  {
    id: 2,
    icon: <Cog className="w-6 h-6 text-primary" />,
    title: "Customize Your Plan",
    description: "Tell us your goals, preferences, and dietary needs. Our AI adapts to your lifestyle."
  },
  {
    id: 3,
    icon: <Check className="w-6 h-6 text-primary" />,
    title: "Enjoy Your Meals",
    description: "Discover delicious, nutritionist-approved meals tailored just for you, every week."
  }
]

export default function HomePage() {
  return (
    <main className='min-h-screen flex flex-col items-center pt-32 w-full gap-16 px-4'>
      <section className='relative w-full max-w-5xl'>
        <div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-3xl -z-10 rounded-[inherit]' />
        <div className='border bg-card/50 backdrop-blur-sm h-[350px] rounded-2xl flex flex-col items-center justify-center text-center gap-6 px-4'>
          <div className="flex items-center gap-4 mb-2">
            <ChefHat size={40} className="text-primary" />
          </div>
          <h1 className='font-bold text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
            Your Personal AI Chef & Nutritionist
          </h1>  
          <p className='text-lg text-muted-foreground max-w-xl'>
            Transform your daily meals with AI-powered personalized meal plans. Save time, eat better, and reach your health goals without the hassle.
          </p>
          <Link href='/sign-up'>
            <Button size="lg" className="font-medium">
              Start your plan
            </Button>
          </Link>
        </div>
      </section>

      <section className='w-full max-w-5xl text-center'>
        <h2 className='mb-4 text-2xl md:text-3xl font-bold'>Smart Meal Planning Made Simple</h2>
        <p className='text-muted-foreground mb-12'>Experience the future of meal planning in three easy steps.</p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {steps.map((step) => (
            <div 
              className='group border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors rounded-xl p-8 flex flex-col items-center gap-4' 
              key={step.id}
            >
              <div className='p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                {step.icon}
              </div>
              <h3 className='font-semibold text-xl'>{step.title}</h3>
              <p className='text-muted-foreground'>{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
