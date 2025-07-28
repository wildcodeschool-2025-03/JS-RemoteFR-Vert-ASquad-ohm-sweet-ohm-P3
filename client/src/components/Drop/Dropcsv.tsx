import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type DropPicsProps = {
  onFileSelect: (file: File) => void;
};

export default function DropPics({ onFileSelect }: DropPicsProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true, // désactive clic auto sur zone, on utilise bouton
    accept: { "csv/*": [] },
  });

  return (
    <div>
      {previewUrl && (
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <p>Prévisualisation :</p>
          <img
            src={previewUrl}
            alt="preview"
            width={200}
            style={{ borderRadius: "6px", maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}

      <div
        {...getRootProps()}
        className="dropzone"
        style={{
          border: "2px dashed #21a89a ",
          padding: "1.5rem",
          textAlign: "center",
          cursor: "pointer",
          borderRadius: "6px",
          marginBottom: "1rem",
        }}
      >
        <input {...getInputProps()} />
        <p>Cliquez sur le bouton</p>
      </div>

      <button type="button" onClick={open} className="selectFileBtn">
        Sélectionner un fichier
      </button>
    </div>
  );
}
