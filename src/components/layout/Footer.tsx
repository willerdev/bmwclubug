import { CLUB_CONTACT, NAV_LINKS } from "@/lib/constants";
import { ClubLogo } from "@/components/ui/ClubLogo";
import Link from "next/link";
import { Globe, Mail, MapPin, Phone, Share2 } from "lucide-react";

export function Footer() {
  const quickLinks = NAV_LINKS.slice(0, 6);
  const communityLinks = [...NAV_LINKS.slice(6), { href: "/shop", label: "Club Shop" }];

  return (
    <footer className="relative border-t border-white/10 glass-frosted mt-8">
      <div className="bmw-m-stripe h-0.5 w-full opacity-60" />
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
          <div className="col-span-2 lg:col-span-1">
            <ClubLogo size="sm" className="mb-5" />
            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
              The official digital home for BMW enthusiasts across Uganda. Driven by passion, united by performance.
            </p>
            <div className="flex gap-3 mt-5">
              {[Globe, Share2, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 glass-panel rounded-full flex items-center justify-center text-white/50 hover:text-bmw-blue-light hover:border-bmw-blue/40 transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold mb-4 text-xs sm:text-sm uppercase tracking-wider text-bmw-blue-light">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-bmw-blue-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold mb-4 text-xs sm:text-sm uppercase tracking-wider text-bmw-red">
              Community
            </h3>
            <ul className="space-y-2.5">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-bmw-blue-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1 min-w-0">
            <h3 className="font-semibold mb-4 text-xs sm:text-sm uppercase tracking-wider text-white/80">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/50">
                <MapPin size={16} className="text-bmw-red shrink-0 mt-0.5" />
                <span>{CLUB_CONTACT.location}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Phone size={16} className="text-bmw-blue shrink-0" />
                <a href={`tel:${CLUB_CONTACT.phone}`} className="hover:text-bmw-blue-light transition-colors">
                  {CLUB_CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Mail size={16} className="text-bmw-blue-light shrink-0" />
                <a href={`mailto:${CLUB_CONTACT.email}`} className="hover:text-bmw-blue-light transition-colors break-all">
                  {CLUB_CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-sm text-white/35">
            &copy; {new Date().getFullYear()} BMW Club Uganda. All rights reserved.
          </p>
          <p className="text-sm text-white/35">
            <span className="text-bmw-blue-light">Driven by Passion.</span>{" "}
            <span className="text-bmw-red">United by Performance.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
