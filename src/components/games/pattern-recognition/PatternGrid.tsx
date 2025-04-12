
import { motion } from "framer-motion";

interface PatternGridProps {
  pattern: number[];
  userPattern: number[];
  isShowingPattern: boolean;
  onCellClick: (index: number) => void;
}

export const PatternGrid = ({ pattern, userPattern, isShowingPattern, onCellClick }: PatternGridProps) => {
  const cells = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
      {cells.map((index) => {
        const isActive = isShowingPattern && pattern.includes(index);
        const isSelected = userPattern.includes(index);
        const isCorrect = pattern[userPattern.indexOf(index)] === index;

        return (
          <motion.div
            key={index}
            className={`aspect-square rounded-lg cursor-pointer flex items-center justify-center text-2xl font-bold transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : isSelected
                ? isCorrect
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-secondary hover:bg-secondary/80"
            }`}
            animate={{
              scale: isActive ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
            onClick={() => !isShowingPattern && onCellClick(index)}
          >
            {index + 1}
          </motion.div>
        );
      })}
    </div>
  );
};
