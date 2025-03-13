"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { useManageSubscription } from "@/lib/hooks/use-manage-subscription"
import { STRIPE_CONFIG } from "@/lib/stripe/config"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual")
  const { startSubscription, isLoading, error } = useManageSubscription()

  const handleSubscribe = async () => {
    try {
      await startSubscription(selectedPlan)
    } catch (error) {
      console.error("Failed to start subscription:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="flex flex-col items-center space-y-4 p-4">
          <h2 className="text-2xl font-semibold">Choose your plan</h2>
          <p className="text-muted-foreground">Select the perfect plan for your needs</p>

          <div className="grid grid-cols-3 gap-4 w-full mt-4">
            {/* Bronze Plan */}
            <Card className={`relative border-2 ${selectedPlan === "monthly" ? "border-primary" : "border-border"}`}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Bronze</h3>
                <p className="text-sm text-muted-foreground mb-2">100 credits</p>
              </CardContent>
            </Card>

            {/* Silver Plan */}
            <Card 
              className={`relative border-2 ${selectedPlan === "monthly" ? "border-primary" : "border-border"} cursor-pointer`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Silver</h3>
                <p className="text-sm text-muted-foreground mb-2">500 credits</p>
              </CardContent>
            </Card>

            {/* Gold Plan */}
            <Card className={`relative border-2 ${selectedPlan === "monthly" ? "border-primary" : "border-border"}`}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Gold</h3>
                <p className="text-sm text-muted-foreground mb-2">2,500 credits</p>
              </CardContent>
            </Card>
          </div>

          <div className="w-full space-y-4 mt-6">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Flexible Credit Usage</h4>
                  <p className="text-sm text-muted-foreground">Mix and match credits—use them all on photos, videos, or a combination of both.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">High-quality AI photos and videos</h4>
                  <p className="text-sm text-muted-foreground">Generated with our advanced Flux™ AI model for photorealistic results.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Commercial Use License</h4>
                  <p className="text-sm text-muted-foreground">Use your AI-generated images and videos for personal or business projects.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer ${selectedPlan === "monthly" ? "border-primary bg-primary/5" : "border-border"}`}
                onClick={() => setSelectedPlan("monthly")}
              >
                <div className="flex justify-between items-center">
                  <span>Monthly</span>
                  <div className="text-right">
                    <span className="font-semibold">${STRIPE_CONFIG.prices.monthly.amount / 100}.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer ${selectedPlan === "annual" ? "border-primary bg-primary/5" : "border-border"}`}
                onClick={() => setSelectedPlan("annual")}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span>Yearly</span>
                    <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Save 50%</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">${STRIPE_CONFIG.prices.annual.amount / 100}.99</span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              Subscribe
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Terms of Service • Restore Purchases • Privacy Policy</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 