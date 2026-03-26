"use client";

import { useState } from "react"
import { FiChevronDown } from "react-icons/fi";

interface Props {
    question: string;
    answer: string;

}

export default function FAQItem({ question, answer}: Props){
    const [open, setOpen] = useState(false);
    return(
        <div className="border-b border-gray-200">
            <button 
                onClick={()=> setOpen(!open)}
                className="w-full flex items-center  justify-between py-4 text-left">
                    <span className="text-sm md:text-base text-gray-800">
                        {question}
                    </span>
                    <FiChevronDown
  className={`text-gray-900 w-5 h-5 transition-transform duration-300 ${
    open ? "rotate-180" : ""
  }`}
/>
            </button>
            {open && (
                <p className="pb-4 text-sm text-gray-600">
                    {answer}
                </p>
            )}
        </div>
    );
}