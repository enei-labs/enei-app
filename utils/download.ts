import axios from "axios";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const handleDownload = async (fileId: string) => {
  try {
    const { data } = await axios.get(`${apiBaseUrl}/s3/getSignedUrl`, {
      params: { fileId },
      withCredentials: true,
    });
    const { signedUrl } = data;

    const response = await fetch(signedUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileId;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("下載文件時出錯:", error);
    // 在這裡處理錯誤，例如顯示錯誤消息給用戶
  }
}

export {
  handleDownload
}