import Link from "next/link";

export default function Button({children, icon, type="link", ...props}){
    return (
        (type === "link") ?
            <Link href={props.href || "#"} className="flex items-center justify-center gap-1 bg-gray-100 px-2 py-1 rounded hover:bg-cyan-500 text-cyan-600 hover:text-gray-100">
                {icon}
                {children}
            </Link>
            :
            <button {...props} className="flex items-center justify-center gap-1 bg-gray-100 px-2 py-1 rounded hover:bg-cyan-500 text-cyan-600 hover:text-gray-100">
                {icon}
                {children}
            </button>
    )
}
