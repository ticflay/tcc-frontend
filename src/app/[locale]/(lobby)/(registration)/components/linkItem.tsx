"use client"
import Link from "next/link";
import {  usePathname } from "next/navigation";

interface LinkItemProps {
    text: string;
    href: string;
}

export default function LinkItem({href, text}: LinkItemProps) {
    const pathname = usePathname();
    return (
        <li className="list-none">
            <Link className={`text-lg font-bold ${pathname === href ? `text-secondary-honeydew` : 'text-primary-burnt_sienna'}`} href={href}>{text}</Link>
        </li>
    )
}