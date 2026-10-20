import { Link } from "react-router-dom";
import { APP_DOWNLOAD_URL } from "../config/app";

export default function DownloadAppButton({ className = "btn btn-primary btn-lg", label = "Descargar la app" }) {
  if (APP_DOWNLOAD_URL) {
    return (
      <a href={APP_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link to="/#descargar" className={className}>
      {label}
    </Link>
  );
}
