import { Button } from "@/components/ui/button";
import { Product } from "@/types/Product";
import { Pencil, Trash2 } from "lucide-react";

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        aria-label={`${product.name} засах`}
        className="px-2 text-slate-600 hover:text-slate-900"
        onClick={() => onEdit(product)}
      >
        <Pencil /> <span className="hidden xl:inline">Засах</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`${product.name} устгах`}
        className="px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => onDelete(product._id!)}
      >
        <Trash2 /> <span className="hidden xl:inline">Устгах</span>
      </Button>
    </div>
  );
};
