import {
  RiShare2Line,
  RiSettings5Line,
  RiFolder6Line,
  RiMessage2Line,
  RiPieChart2Line,
  RiLinksLine,
  RiBarChart2Line,
  RiZoomInLine,
  RiSearchLine,
  RiSendPlaneFill,
  RiFileList2Line,
} from "react-icons/ri";
import { Link } from "react-router-dom";

const QuickActionsCard = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 border border-base-300">
      <div className="border-b border-gray-300 mb-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <p className="text-sm text-gray-500 pb-3">
          Common tasks and actions to get started
        </p>
      </div>

      <Link to="/upload_one" className="w-full flex items-center justify-center gap-2 bg-[#1E2839] cursor-pointer text-white font-medium py-2.5 rounded-md mb-6 transition">
        <RiShare2Line className="text-white" />
        Upload New Essay
      </Link>

      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Features We Provide
      </h3>
      <div className="grid grid-cols-2 gap-5 text-sm text-gray-700">
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
          Draft Comparison (Optional)
        </div>
        <div className="flex items-center gap-2">
          <RiSearchLine className="text-gray-500 text-xl" />
          Tracked Revisions with Metadata
        </div>
        <div className="flex items-center gap-2">
          <RiSettings5Line className="text-gray-500 text-xl" />
          Admin Custom Guidelines
        </div>
        <div className="flex items-center gap-2">
          <RiZoomInLine className="text-gray-500 text-xl" />
          Multi-Pass Grammar & Style Checks
        </div>
        <div className="flex items-center gap-2">
          <RiMessage2Line className="text-gray-500 text-xl" />
          Inline Comments & Feedback
        </div>
        <div className="flex items-center gap-2">
          <RiBarChart2Line className="text-gray-500 text-xl" />
          Essay-Specific Criteria
        </div>
        <div className="flex items-center gap-2">
          <RiPieChart2Line className="text-gray-500 text-xl" />
          Analytics Dashboard (Upcoming)
        </div>
      </div>
    </div>
  );
};

export default QuickActionsCard;
