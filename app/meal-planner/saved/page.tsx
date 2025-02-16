export default function SavedMealPlansPage() {
    return (
        <main className='min-h-screen w-full pt-20'>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className='font-bold text-3xl md:text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                                Saved Meal Plans
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                View and manage your saved meal plans
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}