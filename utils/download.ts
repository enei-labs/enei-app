import axios from "axios";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const handleDownload = async (fileId: string) => {
  const response = await axios.get<{ signedUrl: string }>(
    `${apiBaseUrl}/s3/getSignedUrl?fileId=${fileId}`
  );
  const { signedUrl } = response.data;

  const link = document.createElement("a");
  link.href = signedUrl;
  link.target = "_blank";
  link.download = fileId;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export {
  handleDownload
}