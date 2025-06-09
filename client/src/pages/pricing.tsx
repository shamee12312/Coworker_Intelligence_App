import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Check, Star } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Pricing() {
  const { user } = useAuth();

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 3 AI agents",
        "1,000 conversations/month",
        "Basic analytics",
        "Email support",
        "Pre-built templates"
      ],
      popular: false,
      plan: "starter"
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month", 
      description: "Ideal for growing businesses",
      features: [
        "Up to 10 AI agents",
        "10,000 conversations/month",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "Team collaboration"
      ],
      popular: true,
      plan: "professional"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited AI agents",
        "Unlimited conversations",
        "Custom analytics",
        "Dedicated support",
        "On-premise deployment",
        "SLA guarantees"
      ],
      popular: false,
      plan: "enterprise"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the perfect plan for your team size and needs. Scale up as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-8 ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-xl scale-105' 
                    : 'border-slate-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}
                
                <CardContent className="p-0">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-slate-600 mb-4">{plan.description}</p>
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      {plan.price}
                      <span className="text-lg font-normal text-slate-600">{plan.period}</span>
                    </div>
                    {plan.period && <p className="text-slate-500">per agent</p>}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {user ? (
                    <Link href="/dashboard">
                      <Button 
                        className={`w-full py-3 font-semibold ${
                          plan.popular 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Current Plan'}
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/signup">
                      <Button 
                        className={`w-full py-3 font-semibold ${
                          plan.popular 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-slate-600">Everything you need to know about our pricing</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I change my plan later?</h3>
                  <p className="text-slate-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Is there a free trial?</h3>
                  <p className="text-slate-600">Yes, all plans come with a 14-day free trial. No credit card required to get started.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">What happens if I exceed my limits?</h3>
                  <p className="text-slate-600">You'll receive notifications before reaching your limits. You can upgrade your plan or purchase additional capacity.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Do you offer custom solutions?</h3>
                  <p className="text-slate-600">Yes, our Enterprise plan includes custom solutions tailored to your specific business needs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
