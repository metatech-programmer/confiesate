import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton = ({ 
  width = '100%', 
  height = '20px',
  borderRadius = '4px',
  className = ''
}: SkeletonProps) => {
  return (
    <motion.div
      className={`bg-gray-200 ${className}`}
      style={{ width, height, borderRadius }}
      animate={{
        opacity: [0.5, 1, 0.5],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
      role="status"
      aria-label="Cargando..."
    />
  );
};
