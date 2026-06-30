export default function SearchFilters({ query, setQuery, filters = [], activeFilter, setActiveFilter, placeholder = 'Search...' }) {
  return (
    <section className="filter-panel">
      <input
        className="search-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
      />
      <div className="chip-row">
        {filters.map((filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}
