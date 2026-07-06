"use client";
import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  User02Icon,
  DashboardSquare02Icon,
  Appointment02Icon,
  Logout01Icon,
  Login01Icon,
  UserAdd01Icon,
  Menu04Icon,
  CancelSquareIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = usePathname();
  const router = useRouter();
  // TODO: add user menu and login/logout functionality
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    function readUser() {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    }
    readUser();
    window.addEventListener("auth-change", readUser);
    return () => window.removeEventListener("auth-change", readUser);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new CustomEvent("auth-change"));
    router.push("/");
  }

  return (
    <nav className="bg-background/80 border-border/50 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <HugeiconsIcon
              icon={SparklesIcon}
              size={20}
              className="text-primary"
            />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">
            Lash Studio
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className={location === "/" ? "bg-secondary" : ""}
            >
              Accueil
            </Button>
          </Link>
          <Link href="/#services">
            <Button variant="ghost" size="sm">
              Prestations
            </Button>
          </Link>
          <Link href="/booking">
            <Button
              variant="ghost"
              size="sm"
              className={location === "/booking" ? "bg-secondary" : ""}
            >
              Réserver
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 gap-2 rounded-full"
                >
                  <HugeiconsIcon icon={User02Icon} size={16} />
                  {user.name || user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href="/dashboard">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <HugeiconsIcon icon={Appointment02Icon} size={16} />
                    Mes rendez-vous
                  </DropdownMenuItem>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <HugeiconsIcon icon={DashboardSquare02Icon} size={16} />
                      Administration
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer gap-2"
                  onClick={handleLogout}
                  variant="destructive"
                >
                  <HugeiconsIcon icon={Logout01Icon} size={16} />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <HugeiconsIcon icon={Login01Icon} size={16} /> Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full">
                  <HugeiconsIcon icon={UserAdd01Icon} size={16} /> S'inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile nav */}

        <Button
          variant="ghost"
          size="sm"
          className={"hover:bg-accent/20 h-8 w-8 md:hidden"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <HugeiconsIcon icon={CancelSquareIcon} size={20} />
          ) : (
            <HugeiconsIcon icon={Menu04Icon} size={20} />
          )}
        </Button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-background space-y-2 border-t px-6 py-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Accueil
              </Button>
            </Link>
            <Link href="/#services" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Prestations
              </Button>
            </Link>
            <Link href="/booking" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Réserver
              </Button>
            </Link>
            {user ? (
              <>
                <div className="bg-muted mx-auto my-2.5 h-0.5 w-1/2 rounded-full" />
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <HugeiconsIcon icon={Appointment02Icon} size={16} />
                    Mes rendez-vous
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <HugeiconsIcon icon={DashboardSquare02Icon} size={16} />
                      Administration
                    </Button>
                  </Link>
                )}
                <Button
                  variant="destructive"
                  className="text-destructive w-full justify-start"
                  onClick={handleLogout}
                >
                  <HugeiconsIcon icon={Logout01Icon} size={16} />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Connexion
                    <HugeiconsIcon icon={Login01Icon} size={18} />
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full rounded-full">
                    <HugeiconsIcon icon={UserAdd01Icon} size={18} />
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
