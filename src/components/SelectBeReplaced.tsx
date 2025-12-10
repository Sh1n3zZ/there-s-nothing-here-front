"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type ReplacementOption = "only_remove_pause_symbols" | "remove_all_punctuation_marks";

export interface SelectBeReplacedProps {
  onSelectionChange?: (selected: Set<ReplacementOption>) => void;
  defaultSelected?: ReplacementOption[];
  className?: string;
}

export function SelectBeReplaced({
  onSelectionChange,
  defaultSelected = [],
  className,
}: SelectBeReplacedProps) {
  const [selected, setSelected] = React.useState<Set<ReplacementOption>>(
    new Set(defaultSelected),
  );

  const handleChange = React.useCallback(
    (option: ReplacementOption, checked: boolean) => {
      const newSelected = new Set(selected);
      if (checked) {
        newSelected.add(option);
      } else {
        newSelected.delete(option);
      }
      setSelected(newSelected);
      onSelectionChange?.(newSelected);
    },
    [selected, onSelectionChange],
  );

  return (
    <div className={className}>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="only-remove-pause-symbols"
            checked={selected.has("only_remove_pause_symbols")}
            onCheckedChange={(checked) =>
              handleChange("only_remove_pause_symbols", checked === true)
            }
          />
          <Label htmlFor="only-remove-pause-symbols">
            Only Remove Pause Symbols
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remove-all-punctuation-marks"
            checked={selected.has("remove_all_punctuation_marks")}
            onCheckedChange={(checked) =>
              handleChange("remove_all_punctuation_marks", checked === true)
            }
          />
          <Label htmlFor="remove-all-punctuation-marks">
            Remove All Punctuation Marks
          </Label>
        </div>
      </div>
    </div>
  );
}

