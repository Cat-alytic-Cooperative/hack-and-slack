import S from "@slack/types";

import { LimiterFuncs, applyLimitersWithOverrides, disallow, truncate } from "@slack-wrench/blocks/lib/limitHelpers";

export const ActionsBlock = (
  block_id: S.ActionsBlock["block_id"],
  elements: S.ActionsBlock["elements"],
  limiterOverrides?: LimiterFuncs
): S.ActionsBlock =>
  applyLimitersWithOverrides<S.ActionsBlock>(
    {
      type: "actions",
      block_id,
      elements,
    },
    {
      elements: [5, truncate],
      block_id: [255, disallow],
    },
    limiterOverrides
  );

export const Actions = ActionsBlock;
