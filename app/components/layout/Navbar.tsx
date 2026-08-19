"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, LogIn, LayoutDashboard } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import logo from "../../../public/trazo_omega.png";

interface NavbarProps {
  shopName?: string;
  isStorefront?: boolean;
  cartCount?: number;
  onOpenCart?: () => void;
}

const linkBase =
  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all";
const ctaBase =
  "flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-sm";

function AuthLinks({
  userId,
  onNavigate,
}: {
  userId: string | null | undefined;
  onNavigate?: () => void;
}) {
  if (userId) {
    return (
      <Link href="/dashboard" onClick={onNavigate} className={ctaBase}>
        <LayoutDashboard className="h-4 w-4" />
        Go to dashboard
      </Link>
    );
  }

  return (
    <>
      <Link href="/login" onClick={onNavigate} className={linkBase}>
        <LogIn className="h-4 w-4" />
        Log In
      </Link>
      <Link href="/signup" onClick={onNavigate} className={ctaBase}>
        Create free shop
      </Link>
    </>
  );
}

function CartButton({
  cartCount,
  onOpenCart,
  size = "default",
}: {
  cartCount: number;
  onOpenCart: () => void;
  size?: "default" | "compact";
}) {
  const iconSize = size === "compact" ? "h-6 w-6" : "h-6 w-6";
  const badgeSize =
    size === "compact"
      ? "h-4 w-4 text-[9px] border"
      : "h-5 w-5 text-[10px] border-2";

  return (
    <button
      onClick={onOpenCart}
      aria-label={`Open cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
      className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition"
    >
      <ShoppingBag className={iconSize} />
      {cartCount > 0 && (
        <span
          className={cn(
            "absolute -top-1 -right-1 bg-emerald-500 text-white font-black rounded-full flex items-center justify-center border-[#0a0a0a] shadow-sm",
            badgeSize,
          )}
        >
          {cartCount}
        </span>
      )}
    </button>
  );
}

export default function Navbar({
  shopName,
  isStorefront = false,
  cartCount = 0,
  onOpenCart,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { userId } = useAuth();

  const isLandingPage = pathname === "/";
  const isDark = isLandingPage || isStorefront;

  if (!isLandingPage && !isStorefront) return null;

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-md",
        isDark
          ? "bg-[#0a0a0a]/80 border-white/5"
          : "bg-white/90 border-gray-100",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl"
          >
            <div className="relative h-9 w-9 rounded-xl overflow-hidden shrink-0 bg-surface-alt">
              <Image
                src={logo}
                alt="Trazo logo"
                fill
                className="object-cover"
              />
            </div>
            <span
              className={cn(
                "tracking-tight truncate max-w-[160px] sm:max-w-none",
                isDark ? "text-white" : "text-gray-900",
              )}
            >
              {isStorefront && shopName ? shopName : "Trazo"}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {/* {isLandingPage && (
              <>
                <Link href="/store/demo" className={linkBase}>
                  Demo Store
                </Link>
                <AuthLinks userId={userId} />
              </>
            )} */}

            {isStorefront && (
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  Powered by Trazo
                </Link>
                {onOpenCart && (
                  <CartButton cartCount={cartCount} onOpenCart={onOpenCart} />
                )}
              </div>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex items-center gap-2 md:hidden">
            {isStorefront && onOpenCart && (
              <CartButton
                cartCount={cartCount}
                onOpenCart={onOpenCart}
                size="compact"
              />
            )}
            {isLandingPage && (
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                {menuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu — landing only */}
      {isLandingPage && (
        <div
          id="mobile-menu"
          className={cn(
            "md:hidden overflow-hidden border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-lg transition-all duration-200",
            menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 border-t-0",
          )}
        >
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/store/demo"
              onClick={() => setMenuOpen(false)}
              className={linkBase}
            >
              Demo Store
            </Link>
            <div className="pt-1 space-y-1">
              <AuthLinks
                userId={userId}
                onNavigate={() => setMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
