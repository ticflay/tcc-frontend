import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { FiMenu as Icon } from 'react-icons/fi'

interface MenuBarMobileProps {
    setter: React.Dispatch<React.SetStateAction<boolean>>;

}
export default function MenuBarMobile({ setter }: MenuBarMobileProps) {
    return (
        <nav className="lg:hidden z-20 fixed top-0 left-0 right-0 h-[60px] bg-white flex [&>*]:my-auto px-2">
            <button
                className="text-4xl flex text-white"
                onClick={() => {
                    setter(oldVal => !oldVal);
                }}
            >
                <Icon color={'black'} />
            </button>
            <Link href="/">
            {/*eslint-disable-next-line*/}
            <span className="font-extrabold text-2xl text-secondary-berkeley_blue">ESGrow</span>
            {/* <img src={""} alt="Company Logo" width={200} height={40} /> */}
          </Link>
            <Link
                className="text-3xl flex text-white"
                href="/login"
            >
                <FaUser />
            </Link>
        </nav>
    )
}