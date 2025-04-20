import { useState, useEffect, useRef } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

interface MasonryProps {
  items: React.ReactNode[];
  columns?: number;
  gap?: number;
}

const Masonry = ({ items, columns = 3, gap = 20 }: MasonryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(columns);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.offsetWidth;
      let newColumnCount = columns;

      if (width < 640) { // sm
        newColumnCount = 1;
      } else if (width < 768) { // md
        newColumnCount = 2;
      }

      setColumnCount(newColumnCount);
    };

    updateColumns();
  }, [columns]);

  useResizeObserver(containerRef, () => {
    if (!containerRef.current) return;
    
    const width = containerRef.current.offsetWidth;
    let newColumnCount = columns;

    if (width < 640) { // sm
      newColumnCount = 1;
    } else if (width < 768) { // md
      newColumnCount = 2;
    }

    setColumnCount(newColumnCount);
  });

  const getColumns = () => {
    const cols: React.ReactNode[][] = Array.from({ length: columnCount }, () => []);
    
    items.forEach((item, i) => {
      cols[i % columnCount].push(item);
    });

    return cols;
  };

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {getColumns().map((column, i) => (
        <div key={i} className="flex flex-col space-y-5">
          {column}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
