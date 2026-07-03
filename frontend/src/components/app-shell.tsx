"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard,
  LogOut, 
  Bell, 
  User,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BsHandbag } from "react-icons/bs";
import { PiGear } from "react-icons/pi";

interface AppShellProps {
  children: ReactNode;
  pageTitle: string;
  headerRight?: ReactNode;
}

export function AppShell({ children, pageTitle, headerRight }: AppShellProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Orders", href: "/orders", icon: BsHandbag },
    { name: "Settings", href: "/settings", icon: PiGear },
  ];

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-border flex-col shrink-0 hidden md:flex fixed h-full z-20">
        <div className="p-6">
          {/* <Image src={vouchLogo} alt="Vouch" className="h-7 w-auto" /> */}
            <Image
                src={"/logos/vouch-logo.png"}
                alt="Vouch"
                width={100}
                height={100}
                className="mb-3"
            />
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-medium'}`}>
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto">
          <Link href="/login" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-60 min-w-0">
        {/* Header */}
        <header className="h-18 border-b border-border bg-white flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
          <div className="flex items-center gap-4">
            {headerRight ? headerRight : (
              <>
                <NotificationsPanel />
                <ProfileModal />
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-6 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const notifications = [
    { title: "Payment Received", body: "Order #123 has been successfully funded. Status updated to Ready to Ship." },
    { title: "Order Dispatched", body: "Order #123 has been marked as dispatched. Rider verification link generated." },
    { title: "Payout Released", body: "₦15,000 has been transferred to your bank account." },
    { title: "Payment Expired", body: "Order #123 payment window has expired." },
    { title: "Underpayment Detected", body: "Buyer has paid ₦10,000 of ₦15,000. Awaiting balance payment." },
    { title: "Disputed", body: "Order #123 has been disputed." },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-90 sm:w-100 p-0 flex flex-col">
        <SheetHeader className="p-6 pb-2 border-b">
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {notifications.map((n, i) => (
            <div key={i} className="p-4 border-b border-border hover:bg-slate-50 transition-colors">
              <h4 className="font-semibold text-sm mb-1">{n.title}</h4>
              <p className="text-sm text-muted-foreground">{n.body}</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ProfileModal() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-secondary" data-testid="button-profile">
          <User className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="sr-only">Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">TechHub Store</h3>
              <p className="text-sm text-muted-foreground">ID: VND-084</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-sm border-b pb-2">Change Password</h4>
            
            <div className="space-y-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Input type={showCurrent ? "text" : "password"} />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground" onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input type={showNew ? "text" : "password"} placeholder="Min 8 characters" />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input type={showConfirm ? "text" : "password"} />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-sm mt-4">
              Note: After updating your password, you will be logged out and redirected to the login page for security purposes.
            </div>

            <Button className="w-full mt-4" data-testid="button-update-password">Update Password</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
