import { useRef, useState } from 'react';
import type { UploadedFile } from '../types/agency';

interface Props {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}

export default function FileUpload({ files, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(f => ({
      id: `${Date.now()}-${f.name}`,
      name: f.name,
      type: f.type,
      size: f.size,
    }));
    onChange([...files, ...newFiles]);
  };

  const removeFile = (id: string) => {
    onChange(files.filter(f => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-white/40'
        }`}
      >
        <div className="text-4xl mb-2">📎</div>
        <p className="text-white font-medium">Arrastrá archivos aquí o hacé clic</p>
        <p className="text-gray-400 text-sm mt-1">Logos, fotos, brand guidelines, referencias — cualquier material de tu marca</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map(file => (
            <li key={file.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-xl">{file.type.startsWith('image/') ? '🖼️' : '📄'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{file.name}</p>
                <p className="text-gray-400 text-xs">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); removeFile(file.id); }}
                className="text-gray-500 hover:text-red-400 transition-colors text-xl leading-none"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
