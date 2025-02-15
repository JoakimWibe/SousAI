import Link from "next/link"
import { ChefHat } from "lucide-react"

const resources = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
]

const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
]

const navigation = [
    { name: "Home", href: "/" },
    { name: "Meal Planner", href: "/meal-plan" },
    { name: "My Account", href: "/account" }
]

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="mt-24 border-t bg-card/50">
            <div className="container mx-auto px-4 pt-12 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    <div className="lg:col-span-2">
                        <Link href='/' className='font-bold text-xl flex items-center gap-3 text-foreground hover:opacity-90 transition-opacity'>
                            <ChefHat size={24} className="text-primary" />
                            <span className='bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                                Sous.ai
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground max-w-sm">
                            Your personal AI chef, creating delicious and nutritious meal plans tailored just for you. We combine artificial intelligence with nutritional science to make healthy eating effortless.
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                            <Link 
                                href="https://github.com/JoakimWibe" 
                                target="_blank"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                            </Link>
                            <Link 
                                href="https://twitter.com" 
                                target="_blank"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Navigation</h3>
                        <ul className="space-y-2">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Resources</h3>
                        <ul className="space-y-2">
                            {resources.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Legal</h3>
                        <ul className="space-y-2">
                            {legal.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t">
                    <p className="text-sm text-muted-foreground text-center">
                        {currentYear} Sous.ai. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}