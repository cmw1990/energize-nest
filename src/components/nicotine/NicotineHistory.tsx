
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

interface NicotineHistoryProps {
  history: {
    id: string;
    nicotine_type: string;
    product_name?: string;
    amount: number;
    unit: string;
    energy_impact: number;
    mood_impact: number;
    cravings_before: number;
    urge_triggers?: string[];
    location?: string;
    notes?: string;
    created_at: string;
  }[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const PAGE_SIZE = 8;

export function NicotineHistory({ history, isLoading, onDelete }: NicotineHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  if (isLoading) {
    return <div className="text-center p-8">Loading history...</div>;
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No nicotine intake logged yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Start tracking your nicotine usage to build your history.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(history.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedHistory = history.slice(startIndex, startIndex + PAGE_SIZE);

  const getNicotineTypeLabel = (type: string) => {
    switch (type) {
      case "cigarette": return "Cigarette";
      case "vape": return "Vape/E-cigarette";
      case "snus": return "Snus";
      case "nicotine_pouch": return "Nicotine Pouch";
      case "gum": return "Nicotine Gum";
      case "patch": return "Nicotine Patch";
      case "lozenge": return "Nicotine Lozenge";
      case "cigar": return "Cigar";
      case "pipe": return "Pipe";
      case "chew": return "Chewing Tobacco";
      default: return type;
    }
  };

  const getImpactColor = (value: number) => {
    if (value <= 3) return "text-red-500";
    if (value <= 7) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {format(parseISO(item.created_at), "MMM d, yyyy h:mm a")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{getNicotineTypeLabel(item.nicotine_type)}</span>
                    {item.product_name && (
                      <span className="text-xs text-muted-foreground">
                        {item.product_name}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {item.amount} {item.unit}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className={getImpactColor(item.energy_impact)}>
                            E{item.energy_impact}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Energy Impact: {item.energy_impact}/10</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className={getImpactColor(item.mood_impact)}>
                            M{item.mood_impact}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mood Impact: {item.mood_impact}/10</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    {(item.urge_triggers || item.notes || item.location) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="w-64">
                            <div className="space-y-2">
                              {item.urge_triggers && item.urge_triggers.length > 0 && (
                                <div>
                                  <p className="font-semibold">Triggers:</p>
                                  <p>{item.urge_triggers.join(", ")}</p>
                                </div>
                              )}
                              {item.location && (
                                <div>
                                  <p className="font-semibold">Location:</p>
                                  <p>{item.location}</p>
                                </div>
                              )}
                              {item.notes && (
                                <div>
                                  <p className="font-semibold">Notes:</p>
                                  <p>{item.notes}</p>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
