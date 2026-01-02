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
  // Ensure at least one option is selected (default to first option if none provided)
  const getInitialSelection = React.useCallback(() => {
    if (defaultSelected.length > 0) {
      return new Set(defaultSelected.slice(0, 1));
    }
    // Default to first option if no default provided
    return new Set<ReplacementOption>(["only_remove_pause_symbols"]);
  }, [defaultSelected]);

  const [selected, setSelected] = React.useState<Set<ReplacementOption>>(
    getInitialSelection,
  );

  // Update parent when selection changes
  React.useEffect(() => {
    onSelectionChange?.(selected);
  }, [selected, onSelectionChange]);

  const handleChange = React.useCallback(
    (option: ReplacementOption, checked: boolean) => {
      if (checked) {
        const newSelected = new Set<ReplacementOption>([option]);
        setSelected(newSelected);
      } else {
        if (selected.size === 1 && selected.has(option)) {
          return;
        }
        const newSelected = new Set<ReplacementOption>();
        setSelected(newSelected);
      }
    },
    [selected],
  );

  const getSelectedText = React.useCallback(() => {
    if (selected.has("only_remove_pause_symbols")) {
      return "Only Remove Pause Symbols";
    }
    if (selected.has("remove_all_punctuation_marks")) {
      return "Remove All Punctuation Marks";
    }
    return "None";
  }, [selected]);

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
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            Current selection: <span className="font-medium text-foreground">{getSelectedText()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

