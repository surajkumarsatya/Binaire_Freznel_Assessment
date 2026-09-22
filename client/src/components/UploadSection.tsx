import type { SelectedFile, Priority } from "../types/job";

type UploadSectionProps = {
  files: SelectedFile[];
  uploading: boolean;
  error: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilesDrop: (files: File[]) => void;
  onPriorityChange: (fileName: string, priority: Priority) => void;
  onUpload: () => void;
};

function UploadSection({
  files,
  uploading,
  error,
  onFileChange,
  onFilesDrop,
  onPriorityChange,
  onUpload,
}: UploadSectionProps) {
  const handleDragOver = (
    event: React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();

    const droppedFiles = Array.from(
      event.dataTransfer.files
    );

    const csvFiles = droppedFiles.filter((file) =>
      file.name.toLowerCase().endsWith(".csv")
    );

    if (csvFiles.length > 0) {
      onFilesDrop(csvFiles);
    }
  };

  return (
    <section className="upload-section">
      <div className="upload-card">
        <h3>Upload CSV file</h3>

        <label
          htmlFor="file-input"
          className="file-picker"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {files.length > 0
            ? `${files.length} CSV file${
                files.length > 1 ? "s" : ""
              } selected`
            : "Choose CSV files"}

          <span className="drag-drop-text">
            or drag & drop CSV files here
          </span>
        </label>

        <input
          id="file-input"
          type="file"
          accept=".csv"
          multiple
          onChange={onFileChange}
          hidden
        />

        {files.length > 0 && (
          <div className="selected-files">
            {files.map((item) => (
              <div
                className="selected-file"
                key={item.file.name}
              >
                <div className="selected-file-info">
                  <span>{item.file.name}</span>

                  <span>
                    {(item.file.size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <div className="file-priority">
                  <button
                    type="button"
                    className={
                      item.priority === "HIGH"
                        ? "file-priority-button active"
                        : "file-priority-button"
                    }
                    onClick={() =>
                      onPriorityChange(
                        item.file.name,
                        "HIGH"
                      )
                    }
                  >
                    High
                  </button>

                  <button
                    type="button"
                    className={
                      item.priority === "LOW"
                        ? "file-priority-button active"
                        : "file-priority-button"
                    }
                    onClick={() =>
                      onPriorityChange(
                        item.file.name,
                        "LOW"
                      )
                    }
                  >
                    Low
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="upload-button"
          onClick={onUpload}
          disabled={files.length === 0 || uploading}
        >
          {uploading ? "Uploading..." : "Upload & Queue"}
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
}

export default UploadSection;