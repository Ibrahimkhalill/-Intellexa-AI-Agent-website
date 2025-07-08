import {
  RiFileList2Line,
  RiLinksLine,
  RiSendPlaneFill,
  RiFolder6Line,
  RiSearchLine,
  RiSettings5Line,
  RiZoomInLine,
  RiMessage2Line,
  RiBarChart2Line,
  RiPieChart2Line,
  RiShareBoxLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";

const ComparisonFile = () => {
  return (
    <div className="max-w-xl mx-auto rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="border-b border-gray-400 mb-4">
        <h2 className="text-xl font-bold text-gray-800">File Comparison Tools</h2>
        <p className="text-sm text-gray-600 pb-3">
          Powerful tools to compare & evaluate essays.
        </p>
      </div>

      <Link to='/upload_comparison' className="w-full flex items-center justify-center gap-2 bg-[#394553] text-white font-medium py-2.5 rounded-md mb-6 transition">
        <RiShareBoxLine className="text-white" />
        Compare New Essay
      </Link>

      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Premium Features
      </h3>
      <div className="space-y-5 text-sm text-gray-800">
        <div className="flex items-center gap-2">
          <RiFileList2Line className="text-gray-500 text-xl" />
          Document Upload (.docx)
        </div>
        <div className="flex items-center gap-2">
          <RiLinksLine className="text-gray-500 text-xl" />
          Source Authenticity Validation
        </div>
        <div className="flex items-center gap-2">
          <RiSendPlaneFill className="text-gray-500 text-xl" />
          Essay Type Classification
        </div>
        <div className="flex items-center gap-2">
          <RiFolder6Line className="text-gray-500 text-xl" />
          Draft Comparison
        </div>
        <div className="flex items-center gap-2">
          <RiSearchLine className="text-gray-500 text-xl" />
          Revision Metadata Tracking
        </div>
        <div className="flex items-center gap-2">
          <RiZoomInLine className="text-gray-500 text-xl" />
          Multi-Pass Grammar Checks
        </div>
        <div className="flex items-center gap-2">
          <RiMessage2Line className="text-gray-500 text-xl" />
          Inline Feedback
        </div>
        <div className="flex items-center gap-2">
          <RiBarChart2Line className="text-gray-500 text-xl" />
          Essay-Specific Criteria
        </div>
        <div className="flex items-center gap-2">
          <RiPieChart2Line className="text-gray-500 text-xl" />
          Analytics Dashboard
        </div>
        <div className="flex items-center gap-2">
          <RiSettings5Line className="text-gray-500 text-xl" />
          Admin Guidelines Setup
        </div>
      </div>
    </div>
  );
};

export default ComparisonFile;
