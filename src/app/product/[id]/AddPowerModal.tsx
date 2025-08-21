import React from 'react';
import { Clock, BookMarked, Pencil, Upload, CheckCircle, FileText, PencilIcon, ArrowBigUp } from "lucide-react";
import type { PowerEntry } from './page';

interface AddPowerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitPowerLater: () => void;
  onEnterPowerManually: () => void;
  onUploadPrescription: (imageUrl?: string, name?: string, phone?: string) => void;
  onSelectSavedPower?: () => void;
  savedPowers?: PowerEntry[];
}

const AddPowerModal: React.FC<AddPowerModalProps> = ({
  open,
  onClose,
  onSubmitPowerLater,
  onEnterPowerManually,
  onUploadPrescription,
  onSelectSavedPower,
  savedPowers = [],
}) => {
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
          <h2 className="flex-1 text-center text-lg md:text-2xl font-bold text-gray-900 tracking-tight">Add Lens Details</h2>
          <button className="p-2" onClick={onClose} aria-label="Close">
            <span className="text-2xl">✕</span>
          </button>
        </div>
        {/* Stepper */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
          <div className="flex flex-col items-center flex-1">
            <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">✓</span>
            <span className="text-xs mt-1 text-gray-700 font-medium">Power Type</span>
          </div>
          <div className="flex-1 h-0.5 bg-green-500 mx-1" />
          <div className="flex flex-col items-center flex-1">
            <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">✓</span>
            <span className="text-xs mt-1 text-gray-700 font-medium">Lenses</span>
          </div>
          <div className="flex-1 h-0.5 bg-green-500 mx-1" />
          <div className="flex flex-col items-center flex-1">
            <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">3</span>
            <span className="text-xs mt-1 text-gray-900 font-bold">Add Power</span>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-2 md:px-6 py-4 md:py-6">
          {/* I don't know my power */}
          <div>
            <div className="text-lg font-bold text-gray-900 mb-2">I don&apos;t know my power</div>
            <div className="flex flex-col gap-3 mb-6">
              <button
                className="flex items-center gap-3 bg-white rounded-xl shadow px-4 py-3 border border-gray-100 hover:shadow-lg transition-all"
                onClick={onSubmitPowerLater}
              >
                <span className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-blue-900" />
                </span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-base text-gray-900">Submit Power Later</div>
                  <div className="text-xs text-gray-500">Add to cart now, submit power within 7 days.</div>
                </div>
                <CheckCircle className="text-green-500 w-7 h-7" />
              </button>
            </div>
          </div>
          {/* I know my power */}
          <div>
            <div className="text-lg font-bold text-gray-900 mb-2">I know my power</div>
            <div className="flex flex-col gap-3">
              {/* Saved Power */}
              {savedPowers.length > 0 && (
                <button
                  className="flex items-center gap-3 bg-white rounded-xl shadow px-4 py-3 border border-gray-100 hover:shadow-lg transition-all relative"
                  onClick={() => onSelectSavedPower && onSelectSavedPower()}
                >
                  <span className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <BookMarked className="w-8 h-8 text-blue-900" />
                  </span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-base text-gray-900">Saved Power <span className="ml-1 inline-block align-middle bg-red-500 text-white text-xs rounded-full px-2">{savedPowers.length}</span></div>
                    <div className="text-xs text-gray-500">Last used / added powers</div>
                  </div>
                  <FileText className="text-blue-700 w-7 h-7" />
                </button>
              )}
              {/* Enter Power Manually */}
              <button
                className="flex items-center gap-3 bg-white rounded-xl shadow px-4 py-3 border border-gray-100 hover:shadow-lg transition-all"
                onClick={onEnterPowerManually}
              >
                <span className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Pencil className="w-8 h-8 text-blue-900" />
                </span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-base text-gray-900">Enter Power Manually</div>
                  <div className="text-xs text-gray-500">Input your latest eye prescription</div>
                </div>
                {/* <span className="text-blue-700 text-2xl">✏️</span> */}
                <PencilIcon className="text-blue-700 w-7 h-7" />
              </button>
              {/* Upload Prescription */}
              <button
                className="flex items-center gap-3 bg-white rounded-xl shadow px-4 py-3 border border-gray-100 hover:shadow-lg transition-all"
                onClick={() => onUploadPrescription && onUploadPrescription()}
              >
                <span className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-900" />
                </span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-base text-gray-900">Upload Prescription</div>
                  <div className="text-xs text-gray-500">Just upload your power prescription</div>
                </div>
                {/* <span className="text-blue-700 text-2xl">⬆️</span> */}
                <ArrowBigUp className="text-blue-700 w-10 h-10" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPowerModal; 