export default function InputText({label, register=()=>{}, name, ...props}){
    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={name} className="text-cyan-500">{label}</label>
            <input {...register(name)} id={name} type="text" {...props} className="bg-gray-200 px-2 py-1 rounded backdrop-filter backdrop-blur-md bg-opacity-20"/>
        </div>
    )
}
