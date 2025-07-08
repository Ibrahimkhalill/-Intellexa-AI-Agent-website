
import QuickAction from "./QuickAction";
import ComparisonFile from "./ComparisonFile";

const UploadEssay = () => {
  return (
    <div className="grid grid-cols-2 ">
        <div>
            <QuickAction/>
        </div>
        <div>
            <ComparisonFile/>
        </div>
    </div>
  );
};

export default UploadEssay;
