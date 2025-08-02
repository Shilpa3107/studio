'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Lightbulb, Type } from 'lucide-react';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    href: '/campaign-brainstormer',
    icon: Lightbulb,
    label: 'Campaign Brainstormer',
  },
  {
    href: '/copy-generator',
    icon: Type,
    label: 'Copy Generator',
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
            </div>
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            Ad Agency AI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='group-data-[collapsible=icon]:hidden'>
        <SidebarSeparator />
        <p className="p-2 text-xs text-muted-foreground">
          Powered by GenAI
        </p>
      </SidebarFooter>
    </>
  );
}
