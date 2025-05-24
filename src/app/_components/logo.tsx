import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="https://www.openvoiceos.org/" className="block" aria-label="Cruip">
      <div className="flex items-center">
        <Image src="/logo.svg" alt="Logo" width={32} height={32} />
        <span className="ml-2 text-black dark:text-white">Open Voice OS</span>
      </div>
    </Link>
  );
}
