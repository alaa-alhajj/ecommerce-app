import { motion } from "framer-motion";
import { FaCartPlus, FaTrashAlt } from "react-icons/fa";

type Props = {
  product: {
    id: number;
    title: string;
    image: string;
    price: number;
  };
  isInCart: boolean;
  onAddToCart: (product: any) => void;
  onRemoveFromCart: (productId: number) => void;
};

export default function ProductCard({
  product,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
    >
      <div className="h-36 w-full flex items-center justify-center overflow-hidden mb-3">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full object-contain mb-4"
        />
      </div>

      <h2 className="font-semibold text-base md:text-lg">
        {product.title}
      </h2>

      <div className="mt-auto pt-3 flex items-center justify-between gap-2">
        <span className="text-gray-600 mt-2 text-sm md:text-base">${product.price}</span>

        {isInCart ? (
          <button
            onClick={() => onRemoveFromCart(product.id)}
            title="Remove from Cart"
            className="text-red-600 hover:text-red-800 transition text-xl cursor-pointer"
            aria-label="Remove from Cart"
          >
            <FaTrashAlt />
          </button>
        ) : (
          <button
            onClick={() => onAddToCart(product)}
            title="Add to Cart"
            className="text-green-600 hover:text-green-800 transition text-xl cursor-pointer"
            aria-label="Add to Cart"
          >
            <FaCartPlus />
          </button>
        )}
      </div>
    </motion.div>
  );
}
