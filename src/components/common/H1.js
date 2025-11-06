export default function H1({ children, white}) {
  return (
    <>
     <div className="relative  mb-4 lg:mb-12 w-fit">
         <h1 className={`text-5xl z-10 font-extrabold text-brand-dark relative inline-block mt-6 lg:mt-16 ${white ? "text-white" : ""}`}>
 {children}
    </h1>
          <span className={`absolute left-0 bottom-0 w-[60%] h-1  ${white ? "bg-brand-navy" : "bg-gray-300"}`} />

    </div>
    
  </>
  );
}
