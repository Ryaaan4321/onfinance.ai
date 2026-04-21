"use client";

import { domainToUnicode } from "url";

export default function Page() {
    function onchange(){
        const element=document.getElementById("ses");
        element?.style.backdropFilter
    }
    return (
        <>
            <div>
                <nav className="flex space-x-96 mt-3">
                    <div className=" bg-green-500 text-white">
                        logo
                    </div>
                    <div id="ses" className="flex  space-x-4 justify-center ">
                        <p>one</p>
                        <p>two</p>
                        <p>three</p>
                        <p>four</p>
                    </div>
                </nav>
                <section className="w-1/4 border-4 border-white bg-green-200 flex items-center flex-col">
                    <img src='img.jpg' className="rounded-sm w-1/2 h-1/2 mt-1 sm:w-1/2">
                    </img>
                    <div className="flex text-left sm:flex-11 sm:text-center sm:text-2xl">
                        the image of the section
                    </div>
                </section>
            </div>
        </>
    )
}