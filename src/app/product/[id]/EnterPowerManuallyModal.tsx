import React, { useState } from 'react';

export interface PowerDetails {
  samePower: boolean;
  leftSPH: string;
  rightSPH: string;
  leftCYL: string;
  rightCYL: string;
  leftAxis: string;
  rightAxis: string;
  leftAddlPower: string;
  rightAddlPower: string;
  lensCategory?: string;
}

interface EnterPowerManuallyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (powerDetails: PowerDetails, name: string, phone: string) => void;
  lensCategory?: string;
}

const SPH_VALUES = [
  '', '-13.00', '-12.75', '-12.50', '-12.25', '-12.00', '-11.75', '-11.50', '-11.25', '-11.00', '-10.75', '-10.50', '-10.25', '-10.00', '-9.75', '-9.50', '-9.25', '-9.00', '-8.75', '-8.50', '-8.25', '-8.00', '-7.75', '-7.50', '-7.25', '-7.00', '-6.75', '-6.50', '-6.25', '-6.00', '-5.75', '-5.50', '-5.25', '-5.00', '-4.75', '-4.50', '-4.25', '-4.00', '-3.75', '-3.50', '-3.25', '-3.00', '-2.75', '-2.50', '-2.25', '-2.00', '-1.75', '-1.50', '-1.25', '-1.00', '-0.75', '-0.50', '-0.25', '0.00', '+0.25', '+0.50', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.25', '+3.50', '+3.75', '+4.00', '+4.25', '+4.50', '+4.75', '+5.00', '+5.25', '+5.50', '+5.75', '+6.00', '+6.25', '+6.50', '+6.75', '+7.00', '+7.25', '+7.50', '+7.75', '+8.00',
];

const CYL_VALUES = [
  '', '-6.00', '-5.75', '-5.50', '-5.25', '-5.00', '-4.75', '-4.50', '-4.25', '-4.00', '-3.75', '-3.50', '-3.25', '-3.00', '-2.75', '-2.50', '-2.25', '-2.00', '-1.75', '-1.50', '-1.25', '-1.00', '-0.75', '-0.50', '-0.25', '0.00', '+0.25', '+0.50', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.25', '+3.50', '+3.75', '+4.00', '+4.25', '+4.50', '+4.75', '+5.00', '+5.25', '+5.50', '+5.75', '+6.00',
];

const ADDL_POWER_VALUES = [
  '', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.25', '+3.50', '+3.75', '+4.00',
];

const EnterPowerManuallyModal: React.FC<EnterPowerManuallyModalProps> = ({ open, onClose, onSubmit, lensCategory }) => {
  const [samePower, setSamePower] = useState(false);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
  // const [cylindrical, setCylindrical] = useState(false);
  const [leftSPH, setLeftSPH] = useState('');
  const [rightSPH, setRightSPH] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [leftCYL, setLeftCYL] = useState('');
  const [rightCYL, setRightCYL] = useState('');
  const [leftAxis, setLeftAxis] = useState('');
  const [rightAxis, setRightAxis] = useState('');
  const [leftAddlPower, setLeftAddlPower] = useState('');
  const [rightAddlPower, setRightAddlPower] = useState('');

  const isFormValid = () => {
    if (!name.trim() || !phone.trim()) return false;
    if (samePower) {
      return leftSPH !== '';
    } else {
      return leftSPH !== '' && rightSPH !== '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    const powerDetails = {
      samePower,
      leftSPH,
      rightSPH: samePower ? leftSPH : rightSPH,
      leftCYL,
      rightCYL: samePower ? leftCYL : rightCYL,
      leftAxis,
      rightAxis: samePower ? leftAxis : rightAxis,
      leftAddlPower,
      rightAddlPower: samePower ? leftAddlPower : rightAddlPower,
      lensCategory,
    };
    onSubmit(powerDetails, name, phone);
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
          <div className="text-xl font-semibold text-gray-900 mb-4">Enter power manually</div>
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex flex-col gap-3 shadow-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={samePower} onChange={e => setSamePower(e.target.checked)} />
              <span className="text-gray-700">I have same power for both eyes</span>
            </label>
            {/* <label className="flex items-center gap-2">
              <input type="checkbox" checked={cylindrical} onChange={e => setCylindrical(e.target.checked)} />
              <span className="text-gray-700">I have cylindrical power</span>
            </label> */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 w-12">Power</span>
                <span className="text-xs text-gray-500 flex-1 text-center">LEFT (OS)</span>
                {!samePower && <span className="text-xs text-gray-500 flex-1 text-center">RIGHT (OD)</span>}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 w-12">SPH</span>
                <select
                  className="flex-1 border rounded-lg px-2 py-1 text-sm"
                  value={leftSPH}
                  onChange={e => setLeftSPH(e.target.value)}
                  required
                >
                  {SPH_VALUES.map(val => (
                    <option key={val} value={val}>{val === '' ? 'Select' : val}</option>
                  ))}
                </select>
                {!samePower && (
                  <select
                    className="flex-1 border rounded-lg px-2 py-1 text-sm"
                    value={rightSPH}
                    onChange={e => setRightSPH(e.target.value)}
                    required
                  >
                    {SPH_VALUES.map(val => (
                      <option key={val} value={val}>{val === '' ? 'Select' : val}</option>
                    ))}
                  </select>
                )}
              </div>
              {/* Optionally add CYL, AXIS fields here if cylindrical is checked */}
              {/* {cylindrical && ( */}
                <>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-500 w-12">CYL</span>
                    <select
                      className="flex-1 border rounded-lg px-2 py-1 text-sm"
                      value={leftCYL}
                      onChange={e => setLeftCYL(e.target.value)}
                    >
                      {CYL_VALUES.map(val => (
                        <option key={val} value={val}>{val === '' ? 'Select' : val}</option>
                      ))}
                    </select>
                    {!samePower && (
                      <select
                        className="flex-1 border rounded-lg px-2 py-1 text-sm"
                        value={rightCYL}
                        onChange={e => setRightCYL(e.target.value)}
                      >
                        {CYL_VALUES.map(val => (
                          <option key={val} value={val}>{val === '' ? 'Select' : val}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-500 w-12">Axis</span>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      className="flex-1 border rounded-lg px-2 py-1 text-sm"
                      value={leftAxis}
                      onChange={e => setLeftAxis(e.target.value)}
                      placeholder="Axis"
                    />
                    {!samePower && (
                      <input
                        type="number"
                        min="1"
                        max="180"
                        className="flex-1 border rounded-lg px-2 py-1 text-sm"
                        value={rightAxis}
                        onChange={e => setRightAxis(e.target.value)}
                        placeholder="Axis"
                      />
                    )}
                  </div>
                </>
              {/* )} */}
              {/* Add Addl. Power if lensCategory is bifocal-progressive or progressive */}
              {(lensCategory === 'bifocal-progressive' || lensCategory === 'progressive') && (
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500 w-12">Addl. Power</span>
                  <select
                    className="flex-1 border rounded-lg px-2 py-1 text-sm"
                    value={leftAddlPower}
                    onChange={e => setLeftAddlPower(e.target.value)}
                  >
                    {ADDL_POWER_VALUES.map(val => (
                      <option key={val} value={val}>{val === '' ? 'Select' : val}</option>
                    ))}
                  </select>
                  {!samePower && (
                    <select
                      className="flex-1 border rounded-lg px-2 py-1 text-sm"
                      value={rightAddlPower}
                      onChange={e => setRightAddlPower(e.target.value)}
                    >
                      {ADDL_POWER_VALUES.map(val => (
                        <option key={val} value={val}>{val === '' ? 'Select' : val}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Name *</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-base"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Name"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm mb-1">Phone Number *</label>
            <input
              type="tel"
              className="w-full border rounded-lg px-3 py-2 text-base"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              placeholder="Phone Number"
            />
          </div>
          <div className="text-xs text-blue-700 mb-4">Can’t find your power, Call <a href="tel:+918470007367" className="underline">+91 8470007367</a></div>
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-white text-base md:text-lg transition-all duration-200 ${isFormValid() ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-300 cursor-not-allowed'}`}
            disabled={!isFormValid()}
          >
            Save & Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterPowerManuallyModal; 