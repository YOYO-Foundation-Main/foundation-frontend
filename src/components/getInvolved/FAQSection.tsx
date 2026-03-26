import FAQItem from "./FAQItem";

const faqs = [
  {
    question: "How can I become a volunteer?",
    answer: "You can apply by filling out our volunteer form and our team will contact you.",
  },
  {
    question: "What are the volunteer roles available?",
    answer: "We offer roles in education, healthcare, event management, and more.",
  },
  {
    question: "Is there any specific experience required?",
    answer: "No prior experience is required. Passion and willingness to help are enough.",
  },
  {
    question: "How much time do I need to commit?",
    answer: "You can choose flexible hours based on your availability.",
  },
  {
    question: "Can I volunteer remotely?",
    answer: "Yes, some roles allow remote participation.",
  },
  {
    question: "Will I receive any training?",
    answer: "Yes, we provide basic training before you start.",
  },
  {
    question: "Do volunteers get reimbursed for expenses?",
    answer: "Some roles include reimbursements depending on the activity.",
  },
];

export default function FAQSection(){
    return(
        <section className="bg-[#F5F5F5] py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-sm text-[#D2252B] mb-2 uppercase">
                            FAQ
                        </p>
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-snug">
                            Frequently Asked Question <br />
                            About Volunteering With Us

                        </h2>
                    </div>
                    <div className="bg-white font-bold rounded-md px-6">
                        {
                            faqs.map((faq,index)=>(
                                <FAQItem
                                    key={index}
                                    question={faq.question}
                                    answer={faq.answer}
                                />
                            ))
                        }

                    </div>
                </div>
            </div>
        </section>
    )
}