import { useMutation } from "@tanstack/react-query";
import { Asset } from "../../../types/inboundRequest";
import { getInboundReportAsset } from "../../../api/endpoints/assets";
import { notification } from "antd";

export interface GetInboundReportAssetQueryProps {
  assets: Asset[];
  onSuccessCallback?: (
    results: { url: string; isImage: boolean; fileName: string }[]
  ) => void;
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

export const useGetInboundReportAssetQuery = () =>
  useMutation<unknown, Error, GetInboundReportAssetQueryProps>({
    mutationFn: async ({ assets }: GetInboundReportAssetQueryProps) => {
      const results = await Promise.allSettled(
        assets.map((asset) => getInboundReportAsset(asset.fileName))
      );
      const processedResults: { blob: Blob; fileName: string }[] = [];
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          processedResults[index] = {
            blob: result.value,
            fileName: assets[index].fileName,
          };
        } else {
          throw new Error(result.reason.toString());
        }
      });
      return processedResults;
    },
    onSuccess: (data, variables) => {
      const processedData = (data as { blob: Blob; fileName: string }[]).map(
        (item) => {
          const isImage = IMAGE_EXTENSIONS.some((ext) =>
            item.fileName.toLowerCase().endsWith(ext)
          );
          const url = URL.createObjectURL(item.blob);
          return {
            url,
            isImage,
            fileName: item.fileName,
          };
        }
      );
      variables.onSuccessCallback?.(processedData);
    },
    onError: (error) => {
      notification.error({
        message: `Không thể lấy ảnh`,
        description: error.message ?? "không lấy được ảnh",
      });
    },
  });
