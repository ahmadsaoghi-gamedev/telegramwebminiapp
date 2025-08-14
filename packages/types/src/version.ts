import { createHash } from "node:crypto";

export const contractsVersion = "1.0.0";

export function contractHash(): string {
  const schemaNames = [
    "zPaginated",
    "zErrorResponse",
    "zUserProfile",
    "zTitleCard",
    "zTitleListRequest",
    "zTitleListResponse",
    "zTitleDetail",
    "zEpisodeSourcesResponse",
    "zCreatePaymentRequest",
    "zCreatePaymentResponse",
    "zPaymentStatusResponse"
  ];

  const data = [
    `v=${contractsVersion}`,
    ...schemaNames
  ].join("|");

  return createHash("sha256")
    .update(data)
    .digest("hex")
    .slice(0, 16); // minimal 16 char
}
