import React, { useRef, useState } from 'react';

interface UploadPrescriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const UploadPrescriptionModal: React.FC<UploadPrescriptionModalProps> = ({ open, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type)) {
        setError('Invalid file type.');
        setSelectedFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type)) {
        setError('Invalid file type.');
        setSelectedFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmit();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end bg-black/40" onClick={onClose}>
      <div
        className="w-full md:w-[50vw] bg-gradient-to-br from-[#f5faff] via-[#faf8f6] to-[#f0f4fa] rounded-t-2xl md:rounded-l-2xl shadow-2xl p-0 overflow-y-auto animate-slideInUp md:animate-slideInRight relative flex flex-col h-[100vh]"
        style={{ position: 'relative', bottom: 0, right: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100 bg-white rounded-t-2xl sticky top-0 z-10">
          <button className="p-2" onClick={onClose} aria-label="Close">
            <span className="text-2xl">←</span>
          </button>
          <h2 className="flex-1 text-center text-lg md:text-2xl font-bold text-gray-900 tracking-tight">Submit Eye Power</h2>
          <button className="p-2" onClick={onClose} aria-label="Close">
            <span className="text-2xl">✕</span>
          </button>
        </div>
        {/* Content */}
        <form className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6" onSubmit={handleSubmit}>
          <div className="text-xl font-semibold text-gray-900 mb-4">Upload Prescription</div>
          <ul className="list-disc pl-5 text-gray-700 text-sm mb-4">
            <li>PDF, JPEG, PNG formats accepted</li>
            <li>Make sure your file size under 5 MB</li>
            <li>Please upload only one file</li>
          </ul>
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 mb-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex gap-4 mb-2">
              <img src="/jpg-icon.png" alt="JPG" className="w-10 h-10" />
              <img src="/png-icon.png" alt="PNG" className="w-10 h-10" />
              <img src="/gif-icon.png" alt="GIF" className="w-10 h-10" />
            </div>
            <div className="text-gray-600 text-sm mb-1">Tap here to upload prescription image</div>
            <div className="text-xs text-gray-400">(Max. size: 5MB)</div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <div className="mt-2 text-green-700 text-xs">Selected: {selectedFile.name}</div>
            )}
            {error && (
              <div className="mt-2 text-red-600 text-xs">{error}</div>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-white text-base md:text-lg transition-all duration-200 ${selectedFile ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-300 cursor-not-allowed'}`}
            disabled={!selectedFile}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPrescriptionModal; 