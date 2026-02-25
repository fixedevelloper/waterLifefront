import './../globals.css'
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <div id="wrapper">
          <div id="page" className="">
         <div className="sign-in-wrap">
             <div className="sign-in-box">
                 <div className="left">
                     <div className="content">
                         {children}
                     </div>
                 </div>
             </div>
         </div>
          </div></div>
  )
}
