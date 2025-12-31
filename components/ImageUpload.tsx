import React, { useRef, useState } from 'react';
import { UploadIcon, SparklesIcon, LeafIcon } from './Icons';

interface ImageUploadProps {
  onImageSelected: (base64: string, previewUrl: string, country: string, plantName: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [country, setCountry] = useState('');
  const [plantName, setPlantName] = useState('');
  const [formError, setFormError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!country.trim()) {
      setFormError("Please enter your country first.");
      return;
    }
    
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onImageSelected(base64, result, country, plantName);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!country.trim()) {
      setFormError("Please enter your country first.");
      return;
    }

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleTextOnlySearch = () => {
    if (!country.trim()) {
      setFormError("Please enter your country.");
      return;
    }
    if (!plantName.trim()) {
      setFormError("Please enter a plant name to search without a photo.");
      return;
    }
    // Send empty strings for image data
    onImageSelected('', '', country, plantName);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 relative">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 left-10 w-64 h-64 bg-jungle-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-10 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="glass-panel w-full max-w-xl rounded-3xl p-8 shadow-2xl relative z-10 border border-white/20">
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-4xl font-display font-bold text-white">
            Identify & Verify
          </h2>
          <p className="text-jungle-100/80">
            Tell us where you are to get localized care instructions.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-semibold text-jungle-300 uppercase tracking-wider ml-1">Country *</label>
                <input 
                  type="text" 
                  value={country}
                  onChange={(e) => { setCountry(e.target.value); setFormError(''); }}
                  placeholder="e.g. Canada"
                  className="w-full glass-input rounded-xl px-4 py-3 outline-none transition-all placeholder-white/30"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold text-jungle-300 uppercase tracking-wider ml-1">Plant Name (Optional)</label>
                <input 
                  type="text" 
                  value={plantName}
                  onChange={(e) => { setPlantName(e.target.value); setFormError(''); }}
                  placeholder="e.g. Monstera"
                  className="w-full glass-input rounded-xl px-4 py-3 outline-none transition-all placeholder-white/30"
                />
             </div>
          </div>

          {formError && (
            <div className="text-red-300 text-sm text-center bg-red-900/30 p-2 rounded-lg border border-red-500/30">
              {formError}
            </div>
          )}

          <div
            onClick={() => {
              if (!country.trim()) {
                setFormError("Please enter your country first.");
                return;
              }
              fileInputRef.current?.click();
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out
              ${isDragging 
                ? 'border-jungle-400 bg-jungle-500/10 scale-[1.02]' 
                : 'border-white/20 hover:border-jungle-400 hover:bg-white/5'
              }
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            
            <div className="flex flex-col items-center space-y-4">
              <div className={`
                p-4 rounded-full transition-colors duration-300 bg-white/10 group-hover:bg-jungle-500/20
              `}>
                <UploadIcon className="w-8 h-8 text-white group-hover:text-jungle-300" />
              </div>
              <div className="space-y-1 text-center">
                <p className="font-semibold text-white text-lg">
                  Upload Plant Photo
                </p>
                <p className="text-jungle-200 text-sm font-medium">
                   Crucial for accurate health assessment & ID
                </p>
                <p className="text-white/40 text-xs pt-1">
                  JPG, PNG, HEIC accepted
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-white/30 text-xs uppercase">Or continue without photo</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            onClick={handleTextOnlySearch}
            className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all font-medium flex items-center justify-center space-x-2 group"
          >
            <LeafIcon className="w-5 h-5 text-jungle-400 group-hover:text-jungle-300 transition-colors" />
            <span>Get Care Instructions by Name</span>
          </button>
        </div>

        <div className="mt-8 flex justify-center">
           <div className="flex items-center space-x-2 text-xs font-medium text-jungle-200/80">
              <SparklesIcon className="w-3 h-3" />
              <span>AI Verification Enabled</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;