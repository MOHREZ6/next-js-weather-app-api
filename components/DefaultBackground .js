 import React from "react";

 function DefaultBackground() {
   return (
     <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
       style={{ backgroundImage: "url('/images/background.jpg')" }}
     ></div>
    );
  }

  export default DefaultBackground ; 
