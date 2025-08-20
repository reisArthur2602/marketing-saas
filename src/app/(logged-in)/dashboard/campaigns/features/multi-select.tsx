import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const MultiSelect = ({
  options,
  value = [],
  onValueChange,
  placeholder = "Selecione opções...",
  className,
  disabled = false,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];

    onValueChange?.(newValue);
  };

  const handleRemove = (valueToRemove: string) => {
    const newValue = value.filter((v) => v !== valueToRemove);
    onValueChange?.(newValue);
  };

  const selectedOptions = options.filter((option) =>
    value.includes(option.value),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("min-h-10 w-full justify-between", className)}
          disabled={disabled}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="mr-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option.value);
                  }}
                >
                  {option.label}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar opções..." />
          <CommandList>
            <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
