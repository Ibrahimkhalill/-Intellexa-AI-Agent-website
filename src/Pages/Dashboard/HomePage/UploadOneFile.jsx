import { useState } from "react";
import { RiFileWord2Line, RiFilePdf2Line, RiVoiceAiLine } from "react-icons/ri";
import { FiUploadCloud } from "react-icons/fi";

const UploadOneFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const getFileIcon = (file) => {
    const fileType = file?.type;

    if (fileType === "application/pdf") {
      return <RiFilePdf2Line className="text-4xl text-red-600" />;
    }

    // Default: Word icon
    return <RiFileWord2Line className="text-4xl text-blue-600" />;
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Quick Actions</h1>

      <div className="flex justify-between gap-10">
        <div className="border border-base-300 bg-base-300 rounded-2xl p-5 w-xl">
          <div className="pb-3 text-gray-700">
            <h4 className="text-xl font-semibold">Uploaded File</h4>
            <p className="text-xs">Here is the details of your file</p>
          </div>

          <div className="mt-4 relative">
            {!selectedFile ? (
              <label className="flex items-center gap-3 border border-gray-300 bg-white p-4 rounded-xl cursor-pointer transition hover:bg-gray-50">
                <FiUploadCloud className="text-2xl text-gray-500" />
                <span className="text-sm text-gray-600">
                  Click to upload file
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center gap-3 border border-white bg-white p-4 rounded-xl">
                {getFileIcon(selectedFile)}
                <div>
                  <p className="text-sm font-semibold">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <label className="ml-auto text-sm text-blue-500 underline cursor-pointer">
                  Change
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="border border-base-300 bg-base-300 rounded-2xl p-5 w-xl">
          <div className="flex gap-2 items-center border border-gray-300 p-3 rounded-lg mb-4">
            <div className="bg-black text-2xl text-white rounded-lg p-3">
              <RiVoiceAiLine />
            </div>
            <h1 className="text-xl font-semibold">Write with Generative AI</h1>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="flex-grow border border-gray-300 rounded-md p-2 outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Select AI Model
              </option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5">GPT-3.5</option>
              <option value="bard">Google Bard</option>
              <option value="claude">Anthropic Claude</option>
              <option value="dall-e">DALL·E (for images)</option>
            </select>
            <button
              className="bg-black text-white px-5 py-2 rounded-md transition"
              onClick={() => alert("Generate button clicked!")}
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      <div className="p-10">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maiores asperiores laboriosam labore deserunt facilis. Reiciendis fuga repudiandae quod ratione quae ducimus, hic eligendi? Animi aliquid blanditiis obcaecati nisi, accusantium sunt id esse a, quaerat maiores quidem doloremque necessitatibus odit quis, maxime recusandae magni deserunt ab quod. Possimus vel ex autem corporis cum est unde, numquam dolor eaque velit et quisquam? Iste accusantium perferendis eligendi nulla? Incidunt neque beatae excepturi eligendi, ut officiis! Aut provident animi molestias repellendus recusandae quasi earum tempora suscipit itaque vitae, quidem repellat eius praesentium natus odit voluptate mollitia. Magnam soluta commodi dignissimos saepe sequi provident voluptate eius molestiae nisi sed ipsa, tenetur iure facilis consequatur mollitia, obcaecati velit cum unde? Tempora excepturi autem provident labore nobis consequuntur nesciunt sed vel fuga necessitatibus iste iure, recusandae totam itaque soluta et accusantium magnam vero ad. Id assumenda ab in, iusto ipsum voluptatibus possimus dolores labore sapiente nobis laborum maiores ratione quaerat quibusdam vero illo temporibus, ex nisi at magnam reiciendis fugit consequatur explicabo esse. Vero doloremque molestias autem nisi velit sed libero nemo enim, ullam, ratione, provident laboriosam temporibus! Beatae deleniti aperiam, reiciendis tempore perspiciatis ullam, expedita quam dignissimos blanditiis, aliquam placeat ea sapiente a recusandae architecto!
        </p>
      </div>
    </div>
  );
};

export default UploadOneFile;
