import { useEffect, useId, useState } from 'react';

interface SubService {
  _id: string;
  name: string;
  slug: string;
  priceAed: number | null;
  durationMinutes: number;
}

interface CategoryGroup {
  category: { _id: string; name: string; slug: string };
  subServices: SubService[];
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-plutonic-blue transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function CategoryAccordion({
  group,
  open,
  onToggle,
  selected,
  onToggleService,
}: {
  group: CategoryGroup;
  open: boolean;
  onToggle: () => void;
  selected: Set<string>;
  onToggleService: (id: string) => void;
}) {
  const panelId = useId();
  const selectedCount = group.subServices.filter((s) => selected.has(s._id)).length;

  return (
    <div
      className={`rounded-xl border transition-colors duration-300 ${
        open ? 'border-sky-300 bg-sky-50/40 shadow-sm' : 'border-sky-100 bg-white hover:border-sky-200'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center gap-4 p-4 md:p-5 text-left"
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-plutonic-blue-dark">{group.category.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {group.subServices.length} service{group.subServices.length !== 1 ? 's' : ''}
            {selectedCount > 0 && (
              <span className="text-plutonic-blue font-semibold"> · {selectedCount} selected</span>
            )}
          </p>
        </div>
        <span className="text-xs font-semibold text-plutonic-blue hidden sm:inline">
          {open ? 'Show less' : 'Show services'}
        </span>
        <Chevron open={open} />
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 md:px-5 md:pb-5 pt-0 space-y-2 border-t border-sky-100/80">
            {group.subServices.length === 0 ? (
              <p className="text-sm text-gray-500 py-3">No services in this category.</p>
            ) : (
              group.subServices.map((s) => (
                <label
                  key={s._id}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    selected.has(s._id)
                      ? 'border-sky-400 bg-white shadow-md shadow-sky-200/50'
                      : 'border-sky-100 bg-white/80 hover:border-sky-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(s._id)}
                    onChange={() => onToggleService(s._id)}
                    className="w-4 h-4 accent-sky-500"
                  />
                  <span className="flex-1 font-medium text-plutonic-blue-dark text-sm">{s.name}</span>
                  <span className="text-plutonic-blue font-bold text-sm shrink-0">
                    {s.priceAed ? `AED ${s.priceAed}` : '—'}
                  </span>
                </label>
              ))
            )}
            <button
              type="button"
              onClick={onToggle}
              className="w-full text-center text-xs font-semibold text-plutonic-blue py-2 hover:underline sm:hidden"
            >
              Show less
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookServicePicker({
  groups,
  selected,
  onToggleService,
  preselectedSlug,
}: {
  groups: CategoryGroup[];
  selected: Set<string>;
  onToggleService: (id: string) => void;
  preselectedSlug?: string;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || groups.length === 0) return;

    if (preselectedSlug) {
      const matchGroup = groups.find((g) => g.subServices.some((s) => s.slug === preselectedSlug));
      if (matchGroup) {
        setExpanded(new Set([matchGroup.category._id]));
      }
    }

    setInitialized(true);
  }, [groups, preselectedSlug, initialized]);

  const toggleCategory = (categoryId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  if (groups.length === 0) {
    return <p className="text-gray-500 text-sm">Loading services…</p>;
  }

  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <CategoryAccordion
          key={g.category._id}
          group={g}
          open={expanded.has(g.category._id)}
          onToggle={() => toggleCategory(g.category._id)}
          selected={selected}
          onToggleService={onToggleService}
        />
      ))}
    </div>
  );
}

export type { CategoryGroup, SubService };
