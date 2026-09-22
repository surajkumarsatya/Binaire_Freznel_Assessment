import type { SelectedFile, Priority } from "../types/job";

type UploadSectionProps = {
  files: SelectedFile[];
  uploading: boolean;
  error: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPriorityChange: (fileName: string, priority: Priority) => void;
  onUpload: () => void;
};

function UploadSection({
  files,
  uploading,
  error,
  onFileChange,
  onPriorityChange,
  onUpload,
}: UploadSectionProps) {
  return (
    <section className="upload-section">
      <div className="upload-card">
        <h3>Upload CSV file</h3>

        <label htmlFor="file-input" className="file-picker">
          {files.length > 0
            ? `${files.length} CSV file${
                files.length > 1 ? "s" : ""
              } selected`
            : "Choose CSV files"}
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