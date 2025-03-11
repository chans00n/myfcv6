"use client"

import { CreditCard, DollarSign, Package, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import React from "react"

export function BillingSettings() {
  // Add a reference for scrolling
  const sectionRef = React.useRef<HTMLDivElement>(null)

  // Scroll to section on mount
  React.useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  return (
    <div ref={sectionRef} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on the <Badge variant="secondary">Pro Plan</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Pro Plan</p>
                <p className="text-sm text-muted-foreground">$15/month, billed monthly</p>
              </div>
            </div>
            <Button variant="outline">Change plan</Button>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium">Plan includes:</p>
            <ul className="mt-2 grid gap-2 text-sm">
              <li className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Unlimited projects</span>
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Unlimited collaborators</span>
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Your next billing date is <strong>August 1, 2023</strong>
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/24</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            Add payment method
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your billing history and download invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 text-sm font-medium">
              <div>Date</div>
              <div>Amount</div>
              <div className="text-right">Invoice</div>
            </div>
            <Separator />
            {[
              { date: "Jul 1, 2023", amount: "$15.00", invoice: "INV-1234" },
              { date: "Jun 1, 2023", amount: "$15.00", invoice: "INV-1233" },
              { date: "May 1, 2023", amount: "$15.00", invoice: "INV-1232" },
            ].map((item, index) => (
              <div key={index} className="grid grid-cols-3 text-sm">
                <div>{item.date}</div>
                <div>{item.amount}</div>
                <div className="text-right">
                  <Button variant="link" size="sm" className="h-auto p-0">
                    {item.invoice}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

