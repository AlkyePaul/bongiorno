export default function H2({ children, white  }) {
  return (
    <>
    <div className="relative  mb-4 lg:mb-12 w-fit">
         <h2 className={`text-3xl font-extrabold text-brand-dark z-10 relative inline-block ${white ? "text-white" : ""}`} >
 {children}
     
    </h2>
     <span className={`absolute left-0 bottom-0 w-[60%] h-1 ${white ? "bg-brand-navy" : "bg-gray-200"} z-0`} />
    </div>
  </>
  );
}
