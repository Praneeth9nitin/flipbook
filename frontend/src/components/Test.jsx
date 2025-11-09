import { useState } from "react";
import HTMLFlipBook from "react-pageflip";
import axios from "axios";

const PdfFlipbook = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    const res = await axios.post("https://flipbook-olz1.onrender.com/upload", formData);
    setLoading(false)
    setImages(res.data.images);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Upload PDF → View as Flipbook</h2>
      <input type="file" className="border-2 border-black" accept="application/pdf" onChange={handleUpload} />
      {loading ? <h1 className="text-3xl">loading...</h1> :images.length > 0 && (
        <HTMLFlipBook width={300} height={450} showCover={true} className="mt-6 shadow-lg">
          {images.map((src, i) => (
            <div key={i} className="page bg-white">
              <img src={src} alt={`Page ${i + 1}`} className="w-full h-full" />
            </div>
          ))}
      {}
        </HTMLFlipBook>
      )}
    </div>
  );
};

export default PdfFlipbook;
