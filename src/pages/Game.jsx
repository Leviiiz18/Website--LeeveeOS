import { useState, useEffect, useRef, useCallback } from 'react'

const GRID_SIZE = 20

// Min-Heap Priority Queue for A*
class PriorityQueue {
  constructor() { this.items = [] }
  enqueue(item, priority) {
    this.items.push({ item, priority })
    this.items.sort((a, b) => a.priority - b.priority)
  }
  dequeue() { return this.items.shift().item }
  isEmpty() { return this.items.length === 0 }
}

export default function Game() {
  const canvasRef = useRef(null)
  
  // Grid state: 0 = empty, 1 = wall
  const [grid, setGrid] = useState(() => Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0)))
  const [start, setStart] = useState({ x: 2, y: 2 })
  const [end, setEnd] = useState({ x: 17, y: 17 })
  
  const [path, setPath] = useState([])
  const [visited, setVisited] = useState([])
  const [isSolving, setIsSolving] = useState(false)
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawMode, setDrawMode] = useState(1) // 1 = draw wall, 0 = erase wall

  const resetPath = () => {
    setPath([])
    setVisited([])
  }

  const clearBoard = () => {
    setGrid(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0)))
    resetPath()
  }

  // A* Algorithm
  const solvePath = () => {
    resetPath()
    setIsSolving(true)
    
    // Convert to 1D strings for Set
    const posToStr = (x, y) => `${x},${y}`
    
    const pq = new PriorityQueue()
    const cameFrom = new Map()
    const costSoFar = new Map()
    
    const startStr = posToStr(start.x, start.y)
    pq.enqueue(start, 0)
    costSoFar.set(startStr, 0)
    
    const visitedSet = new Set()
    
    const sleep = ms => new Promise(r => setTimeout(r, ms))
    
    const runAStar = async () => {
      while (!pq.isEmpty()) {
        const current = pq.dequeue()
        const currentStr = posToStr(current.x, current.y)
        
        visitedSet.add(currentStr)
        setVisited(Array.from(visitedSet).map(s => {
          const [x, y] = s.split(',').map(Number)
          return { x, y }
        }))
        
        if (current.x === end.x && current.y === end.y) {
          // Reconstruct path
          const fullPath = []
          let curr = currentStr
          while (curr !== startStr) {
            const [x, y] = curr.split(',').map(Number)
            fullPath.push({ x, y })
            curr = cameFrom.get(curr)
          }
          fullPath.push(start)
          setPath(fullPath.reverse())
          setIsSolving(false)
          return
        }
        
        const neighbors = [
          { x: current.x + 1, y: current.y },
          { x: current.x - 1, y: current.y },
          { x: current.x, y: current.y + 1 },
          { x: current.x, y: current.y - 1 }
        ]
        
        for (const next of neighbors) {
          if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE) continue
          if (grid[next.y][next.x] === 1) continue // Wall
          
          const newCost = costSoFar.get(currentStr) + 1
          const nextStr = posToStr(next.x, next.y)
          
          if (!costSoFar.has(nextStr) || newCost < costSoFar.get(nextStr)) {
            costSoFar.set(nextStr, newCost)
            // Heuristic (Manhattan distance)
            const priority = newCost + Math.abs(end.x - next.x) + Math.abs(end.y - next.y)
            pq.enqueue(next, priority)
            cameFrom.set(nextStr, currentStr)
          }
        }
        
        await sleep(15) // Slow down for visualization
      }
      setIsSolving(false)
    }
    
    runAStar()
  }

  // Draw Grid
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const tileSize = canvas.width / GRID_SIZE

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw cells
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const px = x * tileSize
        const py = y * tileSize
        
        // Base grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'
        ctx.strokeRect(px, py, tileSize, tileSize)
        
        // Visited
        if (visited.some(v => v.x === x && v.y === y)) {
           ctx.fillStyle = 'rgba(139, 92, 246, 0.4)' // Purple
           ctx.fillRect(px + 1, py + 1, tileSize - 2, tileSize - 2)
        }
        
        // Path
        if (path.some(p => p.x === x && p.y === y)) {
           ctx.fillStyle = 'rgba(74, 222, 128, 0.8)' // Green
           ctx.fillRect(px + 1, py + 1, tileSize - 2, tileSize - 2)
        }
        
        // Wall
        if (grid[y][x] === 1) {
           ctx.fillStyle = '#64748b'
           ctx.fillRect(px, py, tileSize, tileSize)
        }
        
        // Start
        if (x === start.x && y === start.y) {
           ctx.fillStyle = '#facc15' // Yellow
           ctx.fillRect(px, py, tileSize, tileSize)
        }
        
        // End
        if (x === end.x && y === end.y) {
           ctx.fillStyle = '#ef4444' // Red
           ctx.fillRect(px, py, tileSize, tileSize)
        }
      }
    }
  }, [grid, start, end, visited, path])

  const handlePointerInteraction = (e) => {
    if (isSolving) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / (rect.width / GRID_SIZE))
    const y = Math.floor((e.clientY - rect.top) / (rect.height / GRID_SIZE))
    
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return
    
    // Don't overwrite start/end
    if ((x === start.x && y === start.y) || (x === end.x && y === end.y)) return

    const newGrid = [...grid]
    newGrid[y] = [...newGrid[y]]
    newGrid[y][x] = drawMode
    setGrid(newGrid)
    
    // If path existed, clear it since we modified walls
    if (path.length > 0 || visited.length > 0) resetPath()
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#0a0f18] p-4 font-mono text-white">
      <div className="w-full max-w-[400px]">
        
        <div className="mb-4 text-center">
           <h2 className="text-[#00d4ff] text-xl font-bold font-sans">A* Pathfinding AI</h2>
           <p className="text-xs text-gray-500 mt-1">Draw walls to block the AI's path</p>
        </div>

        <div 
          className="relative rounded shadow-[0_0_30px_rgba(0,212,255,0.1)] border-2 border-white/10 m-auto cursor-crosshair overflow-hidden touch-none" 
          style={{ width: 400, height: 400 }}
          onPointerDown={(e) => {
             setIsDrawing(true)
             // Determine mode (draw or erase) based on first click
             const rect = canvasRef.current.getBoundingClientRect()
             const x = Math.floor((e.clientX - rect.left) / (400 / GRID_SIZE))
             const y = Math.floor((e.clientY - rect.top) / (400 / GRID_SIZE))
             setDrawMode(grid[y][x] === 1 ? 0 : 1)
             handlePointerInteraction(e)
          }}
          onPointerMove={(e) => isDrawing && handlePointerInteraction(e)}
          onPointerUp={() => setIsDrawing(false)}
          onPointerLeave={() => setIsDrawing(false)}
        >
          <canvas ref={canvasRef} width={400} height={400} className="block w-full h-full pointer-events-none" />
        </div>

        <div className="mt-6 flex justify-between gap-2">
           <button 
             onClick={clearBoard} disabled={isSolving}
             className="flex-1 py-2 px-4 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
           >
             Clear Maze
           </button>
           <button 
             onClick={solvePath} disabled={isSolving}
             className="flex-1 py-2 px-4 bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/50 rounded hover:bg-[#00d4ff] hover:text-[#0a0f18] disabled:opacity-50 transition-colors font-bold"
           >
             Find Path
           </button>
        </div>
      </div>
    </div>
  )
}
