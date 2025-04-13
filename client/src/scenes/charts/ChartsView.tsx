import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import * as math from 'mathjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  ChartOptions
} from 'chart.js';
import { IconCalculator, IconTable, IconTrash, IconPlus, IconChartLine, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useTheme } from '@/providers/ThemeProvider';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController,
  Title,
  Tooltip,
  Legend
);

type InputMode = 'function' | 'dataset';
type ChartEntry = {
  id: string;
  input: string;
  color: string;
  data: { x: number; y: number }[];
  visible: boolean;
};

// Generate a random color with good contrast
const getRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsla(${hue}, 80%, 65%, 0.8)`;
};

// Generate x values within a range
const generateXValues = (start: number, end: number, steps: number): number[] => {
  const xValues: number[] = [];
  const stepSize = (end - start) / steps;
  
  for (let i = 0; i <= steps; i++) {
    xValues.push(start + i * stepSize);
  }
  
  return xValues;
};

const ChartsView = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [inputMode, setInputMode] = useState<InputMode>('function');
  const [inputValue, setInputValue] = useState<string>('x^2');
  const [chartEntries, setChartEntries] = useState<ChartEntry[]>([]);
  const [xRange, setXRange] = useState({ min: -10, max: 10 });
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Process function expression
  const processFunction = (expr: string): { x: number; y: number }[] => {
    try {
      // Compile the expression to improve performance
      const compiledExpr = math.compile(expr);
      const xValues = generateXValues(xRange.min, xRange.max, 200);
      
      // Calculate y values for each x
      return xValues.map(x => {
        try {
          const y = compiledExpr.evaluate({ x });
          // Filter out non-finite values (Infinity, NaN)
          return Number.isFinite(y) ? { x, y } : null;
        } catch {
          return null;
        }
      }).filter(point => point !== null) as { x: number; y: number }[];
    } catch (e) {
      console.error("Error evaluating function:", e);
      setError(`Error: ${(e as Error).message}`);
      return [];
    }
  };

  // Process dataset input
  const processDataset = (dataText: string): { x: number; y: number }[] => {
    try {
      // Try to parse the input as JSON
      let parsed;
      try {
        parsed = JSON.parse(dataText);
      } catch {
        // If it fails, try to evaluate as a JavaScript array
        parsed = math.evaluate(dataText);
      }
      
      // Handle different data formats
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          return [];
        }
        
        // Check if the array contains objects with x and y properties
        if (typeof parsed[0] === 'object' && 'x' in parsed[0] && 'y' in parsed[0]) {
          return parsed.map(p => ({ x: Number(p.x), y: Number(p.y) }));
        }
        
        // If it's a simple array of numbers, use array indices as x values
        return parsed.map((y, x) => ({ x, y: Number(y) }));
      }
      
      throw new Error('Invalid dataset format. Expected an array.');
    } catch (e) {
      console.error("Error parsing dataset:", e);
      setError(`Error: ${(e as Error).message}`);
      return [];
    }
  };

  // Add a new entry to the chart
  const addEntry = () => {
    if (!inputValue.trim()) {
      setError('Please enter a function or dataset');
      return;
    }
    
    try {
      setError(null);
      const data = inputMode === 'function' 
        ? processFunction(inputValue)
        : processDataset(inputValue);
      
      if (data.length === 0) {
        setError('No valid data points generated');
        return;
      }
      
      const newEntry: ChartEntry = {
        id: Date.now().toString(),
        input: inputValue,
        color: getRandomColor(),
        data,
        visible: true
      };
      
      setChartEntries(prev => [...prev, newEntry]);
      
      // Clear the input for a fresh entry
      setInputValue('');
      
      // Focus back on input for convenience
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
    }
  };

  // Remove an entry from the chart
  const removeEntry = (id: string) => {
    setChartEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Toggle visibility of an entry
  const toggleEntryVisibility = (id: string) => {
    setChartEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, visible: !entry.visible } : entry
      )
    );
  };

  // Update chart when x range changes
  useEffect(() => {
    // Recalculate function entries when x range changes
    setChartEntries(prev => 
      prev.map(entry => {
        if (inputMode === 'function') {
          try {
            const compiledExpr = math.compile(entry.input);
            const xValues = generateXValues(xRange.min, xRange.max, 200);
            
            const data = xValues.map(x => {
              try {
                const y = compiledExpr.evaluate({ x });
                return Number.isFinite(y) ? { x, y } : null;
              } catch {
                return null;
              }
            }).filter(point => point !== null) as { x: number; y: number }[];
            
            return { ...entry, data };
          } catch (e) {
            console.error("Error updating function:", e);
            return entry;
          }
        }
        return entry;
      })
    );
  }, [xRange, inputMode]);

  // Prepare chart data for Chart.js
  const chartData = {
    datasets: chartEntries
      .filter(entry => entry.visible)
      .map(entry => ({
        label: entry.input,
        data: entry.data,
        borderColor: entry.color,
        backgroundColor: entry.color.replace('0.8', '0.2'),
        pointRadius: inputMode === 'dataset' ? 3 : 0,
        borderWidth: 2,
        tension: 0.1,
        showLine: true
      }))
  };

  // Chart.js options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#ccc' : '#333',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#333' : '#fff',
        titleColor: isDarkMode ? '#fff' : '#333',
        bodyColor: isDarkMode ? '#ccc' : '#666',
        borderColor: isDarkMode ? '#555' : '#ddd',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: (context) => {
            return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'center',
        title: {
          display: true,
          text: 'x',
          color: isDarkMode ? '#ccc' : '#333',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#ccc' : '#333'
        }
      },
      y: {
        type: 'linear',
        position: 'center',
        title: {
          display: true,
          text: 'y',
          color: isDarkMode ? '#ccc' : '#333',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#ccc' : '#333'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Math Charts</h1>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${
                  inputMode === 'function' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
                onClick={() => setInputMode('function')}
              >
                <IconCalculator size={16} />
                Function
              </button>
              <button
                className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${
                  inputMode === 'dataset' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
                onClick={() => setInputMode('dataset')}
              >
                <IconTable size={16} />
                Dataset
              </button>
            </div>
          </div>

          {/* Input area */}
          <div className="bg-card rounded-lg p-4 shadow-md">
            <div className="flex flex-col gap-3">
              <label htmlFor="expression" className="text-sm font-medium">
                {inputMode === 'function' ? 'Function Expression' : 'Dataset Input'}
              </label>
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  id="expression"
                  className="flex-1 bg-background border border-border rounded-md p-2 text-sm font-mono min-h-[80px]"
                  placeholder={
                    inputMode === 'function'
                      ? 'e.g., sin(x), x^2, 2*x+3'
                      : 'e.g., [1,2,3,4] or [{x:1,y:2},{x:2,y:4}]'
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      e.preventDefault();
                      addEntry();
                    }
                  }}
                />
                <button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  onClick={addEntry}
                >
                  <IconPlus size={18} />
                </button>
              </div>
              {error && <div className="text-destructive text-sm">{error}</div>}
              
              {inputMode === 'function' && (
                <div className="flex gap-4 mt-2">
                  <div className="flex gap-2 items-center">
                    <label htmlFor="xmin" className="text-xs">X Min:</label>
                    <input
                      id="xmin"
                      type="number"
                      className="w-16 bg-background border border-border rounded px-2 py-1 text-xs"
                      value={xRange.min}
                      onChange={(e) => setXRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label htmlFor="xmax" className="text-xs">X Max:</label>
                    <input
                      id="xmax"
                      type="number"
                      className="w-16 bg-background border border-border rounded px-2 py-1 text-xs"
                      value={xRange.max}
                      onChange={(e) => setXRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart area */}
          <div className="bg-card rounded-lg p-4 shadow-md">
            <div className="h-[500px] relative">
              {chartEntries.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <IconChartLine size={48} strokeWidth={1} />
                  <p className="mt-4">Add a function or dataset to visualize</p>
                </div>
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Legend/Entries list */}
          {chartEntries.length > 0 && (
            <div className="bg-card rounded-lg p-4 shadow-md">
              <h3 className="text-md font-medium mb-3">Equations & Datasets</h3>
              <div className="space-y-2">
                {chartEntries.map(entry => (
                  <div 
                    key={entry.id} 
                    className="flex items-center justify-between p-2 rounded hover:bg-secondary/20"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className={`font-mono ${!entry.visible ? 'line-through text-muted-foreground' : ''}`}>
                        {entry.input}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="text-muted-foreground hover:text-foreground p-1"
                        onClick={() => toggleEntryVisibility(entry.id)}
                        title={entry.visible ? "Hide" : "Show"}
                      >
                        {entry.visible ? 
                          <IconEye size={16} /> : 
                          <IconEyeOff size={16} />
                        }
                      </button>
                      <button 
                        className="text-muted-foreground hover:text-destructive p-1"
                        onClick={() => removeEntry(entry.id)}
                        title="Remove"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsView; 