import { useRef, useState, type ChangeEvent } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { processImageFile } from '../../utils/imageUpload';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = '/images/example.jpg',
  required = false,
  helpText = 'Upload a photo from your computer/phone or enter an image URL/path below.',
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setIsProcessing(true);
    try {
      const optimizedDataUrl = await processImageFile(file, 1400, 1400, 0.85);
      onChange(optimizedDataUrl);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to process image file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[#E2D2A4] uppercase tracking-wider text-xs font-medium">
          {label} {required && '*'}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 uppercase tracking-wider"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Upload Zone & Preview */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Thumbnail Preview */}
        <div className="w-20 h-20 shrink-0 rounded-sm bg-black/60 border border-white/15 overflow-hidden flex items-center justify-center relative">
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <ImageIcon className="text-gray-600" size={24} />
          )}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#D4AF37]" size={20} />
            </div>
          )}
        </div>

        {/* Upload Action Button */}
        <div className="flex-1 w-full space-y-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <UploadCloud size={15} className="text-[#D4AF37]" />
                <span>Upload From Device</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-gray-500 leading-tight">
            {helpText}
          </p>
        </div>
      </div>

      {/* Text URL input fallback */}
      <div className="relative">
        <input
          type="text"
          required={required}
          placeholder={placeholder}
          value={value.startsWith('data:') ? '[Uploaded Image Attached]' : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2 bg-black/60 border border-white/15 focus:border-[#D4AF37] text-white text-xs rounded-sm focus:outline-none"
        />
      </div>

      {errorMessage && (
        <p className="text-xs text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
