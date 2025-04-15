import { Image } from "antd";
import React from "react";

interface Asset {
  url: string;
  fileName: string;
  isImage: boolean;
}

interface AssetPreviewProps {
  assetUrls: Asset[];
  isPending: boolean;
}

const AssetPreview: React.FC<AssetPreviewProps> = ({
  assetUrls,
  isPending,
}) => {
  return (
    <div>
      <h2>Tài liệu đính kèm:</h2>
      {assetUrls.length > 0 && assetUrls.some((item) => item.isImage) && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {assetUrls.map((asset, index) => (
            <div key={index}>
              {asset.isImage ? (
                <Image
                  src={asset.url}
                  alt={asset.fileName}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <a href={asset.url} download={asset.fileName}>
                  Tải xuống {asset.fileName}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
      {isPending && <p>Đang tải tài liệu.</p>}
    </div>
  );
};

export default AssetPreview;
