
import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckIcon, AlertCircleIcon, CreditCardIcon, LockIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const SubscriptionPage = () => {
  const [currentPage, setCurrentPage] = React.useState("dashboard");

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subscription</h1>
          <Badge
            variant="outline"
            className="text-sm px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
          >
            Pro
          </Badge>
        </div>
        
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Pro Plan</h3>
                <p className="text-sm text-muted-foreground">Monthly subscription</p>
              </div>
              <p className="font-bold text-xl">$9.99/month</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Next billing date: January 31, 2024</p>
              <p className="text-sm text-muted-foreground">Plan started: December 01, 2023</p>
            </div>
            
            <div className="pt-2">
              <h4 className="font-medium mb-2">Included Features:</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unlimited medication tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced weight trends and analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Integration with fitness apps</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => toast({
                title: "Plan change",
                description: "Contact support to change your subscription plan."
              })}
            >
              Change Plan
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => toast({
                variant: "destructive",
                title: "Cancellation request",
                description: "Please contact support to cancel your subscription."
              })}
            >
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your payment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center border rounded-md p-3">
              <CreditCardIcon className="h-6 w-6 mr-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Visa · Expires 09/2026</p>
              </div>
              <Badge className="ml-4">Default</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => toast({
                title: "Payment method",
                description: "Update your payment method in account settings."
              })}
            >
              Update Payment Method
            </Button>
            <Button 
              variant="outline" 
              onClick={() => toast({
                title: "Billing history",
                description: "View your billing history in account settings."
              })}
            >
              View Billing History
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Explore other subscription options</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Basic</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                    Popular
                  </Badge>
                </CardTitle>
                <CardDescription>Essential features</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">$4.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Basic medication tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Weight tracking</span>
                  </li>
                  <li className="flex items-center">
                    <AlertCircleIcon className="h-5 w-5 text-gray-300 mr-2" />
                    <span className="text-muted-foreground">App integrations</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => toast({
                    title: "Downgrade requested",
                    description: "Contact support to downgrade your subscription."
                  })}
                >
                  Downgrade
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20">
              <CardHeader className="pb-2">
                <CardTitle>Premium</CardTitle>
                <CardDescription>All features plus exclusive benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">$14.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>AI-powered health insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Personal health coach</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Exclusive content</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => toast({
                    title: "Upgrade requested",
                    description: "Contact support to upgrade your subscription."
                  })}
                >
                  Upgrade
                </Button>
              </CardFooter>
            </Card>
          </CardContent>
        </Card>
        
        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
          <LockIcon className="h-4 w-4 mr-2" />
          <span>All payments are processed securely via Stripe</span>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage;
