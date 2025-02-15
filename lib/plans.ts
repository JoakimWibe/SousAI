export interface Plan {
    name: string;
    amount: number;
    currency: string;
    interval: string;
    isPopular?: boolean;
    description: string;
    features: string[];
} 

export const availablePlans: Plan[] = [
    {
        name: 'Weekly Plan',
        amount: 49,
        currency: 'NOK',
        interval: 'week',
        description: 'Perfect if you want to try the service before comitting longer.',
        features: [
            'Unlimited AI meal plans',
            'AI nutrition insights',
            'Cancel anytime'
        ]
    },
    {
        name: 'Monthly Plan',
        amount: 89,
        currency: 'NOK',
        interval: 'month',
        description: 'Perfect for ongoing, month-to-month meal planning and features.',
        features: [
            'Unlimited AI meal plans',
            'AI nutrition insights',
            'Cancel anytime'
        ],
        isPopular: true
    },
    {
        name: 'Yearly Plan',
        amount: 999,
        currency: 'NOK',
        interval: 'year',
        description: 'Best value for those comitted to improving their diet long-term',
        features: [
            'Unlimited AI meal plans',
            'AI nutrition insights',
            'Cancel anytime'
        ]
    },
]

const priceIdMap: Record<string, string> = {
    week: process.env.STRIPE_PRICE_WEEKLY!,
    month: process.env.STRIPE_PRICE_MONTHLY!,
    year: process.env.STRIPE_PRICE_YEARLY!
}

export const getPriceIdFromType = (planType: string) => priceIdMap[planType];