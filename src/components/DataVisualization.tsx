// Data visualization component
function DataVisualization() {
  return (
    <div className="relative mt-4 mb-3 premium-glass rounded-lg p-2 border border-secondary/20 premium-hover">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-xs uppercase tracking-wider text-secondary font-mono">Research Activity</h4>
        <span className="text-xs font-mono text-lightText/50 tech-blink">LIVE DATA</span>
      </div>
      <div className="h-12 flex items-end gap-1">
        {Array.from({ length: 28 }).map((_, i) => {
          const height = 15 + Math.random() * 25;
          return (
            <div 
              key={i} 
              className="data-bar" 
              style={{ height: `${height}px`, width: '8px' }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default DataVisualization; 