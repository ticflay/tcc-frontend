'use client';

import { useRouter, usePathname } from '@/navigation';
import { ChangeEvent } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { GrLanguage } from 'react-icons/gr'

interface LanguageSelectorProps {
    locale: 'en' | 'pt',
    color?: string;
}

export default function LanguageSelector({ locale, color}:LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    router.push(pathname, { locale: e.target.value });
  };

  return (
    <div className='flex flex-row gap-1 items-center relative cursor-pointer z-10'>
      
      <select  value={locale} onChange={handleChange} className='w-10 opacity-0 h-[calc(1.2em+24px)]'>
    <option value="pt" >Português</option>
      <option value="en">English</option>
    </select>
    <GrLanguage className="absolute -z-10 " color={color}/>
    <FaChevronDown className="absolute left-6 -z-10" size={14} fill={color} />
    </div>
  );
}