import { useState } from "react";

const ComparisonResult = () => {
  const tabs = [
    { label: "Summary", value: "summary", content: <>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta dignissimos a porro harum? Autem neque praesentium tempore, repudiandae ad tenetur doloribus voluptate sit deserunt. Dolorum, nihil perferendis assumenda in quisquam est fugit, deleniti magni amet dolore mollitia ea incidunt expedita, non optio laborum ratione accusamus consequuntur labore odit! Officiis ab praesentium saepe, explicabo nulla fuga laborum optio tempora! Dolorum, commodi harum. Id dolorum soluta modi aspernatur expedita corrupti laboriosam, deleniti eum exercitationem minus iusto natus quaerat? Voluptatem vitae atque veniam omnis debitis minus laudantium ea reiciendis laboriosam distinctio id voluptates voluptas quo, fugiat totam ab accusamus? Qui unde amet facere cum, doloremque eaque assumenda a adipisci officia quod eius tempora nihil rerum modi soluta natus hic eum magni ipsa, ipsum, sapiente maiores. A magnam nisi reprehenderit labore, distinctio repellat incidunt voluptatibus blanditiis quasi odio facere? Cupiditate eum officia nostrum enim dolor cumque harum obcaecati a dolorum dicta? Nam autem optio qui quam asperiores! Enim ex hic cum nisi blanditiis fugiat molestiae? Vitae magni distinctio praesentium eaque labore, deserunt placeat veritatis eveniet, quae accusamus voluptatem quidem cumque. Alias provident debitis, aliquid inventore corporis blanditiis nemo earum, hic nihil assumenda obcaecati velit sapiente expedita! Veniam tenetur facilis aperiam. Impedit voluptates corrupti molestiae.</> },
    { label: "Key Changes", value: "history", content: <>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio culpa beatae eius inventore asperiores praesentium voluptates quam aperiam. Ad, consequatur?</> },
  ];

  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div>
      <div className="bg-[#647187] p-2 rounded-xl mb-4 flex justify-between gap-2 text-white text-center items-center w-full mt-10">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm w-full font-medium transition-all duration-500 ${
              activeTab === tab.value
                ? "bg-[#1E2839]  shadow-sm"
                : "hover:bg-[#1E2839]/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div>{tabs.find((tab) => tab.value === activeTab)?.content}</div>
    </div>
  );
};

export default ComparisonResult;
