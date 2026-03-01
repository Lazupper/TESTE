interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter = ({ categories, selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
            selected === cat
              ? 'gradient-primary text-primary-foreground shadow-lg'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
