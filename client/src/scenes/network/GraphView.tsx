import { useState, useRef, useCallback, useEffect } from 'react';
// @ts-expect-error - Type declarations for react-force-graph-3d
import ForceGraph3D from 'react-force-graph-3d';
import { useNotes } from '@/hooks/useNotes';
import { useLinks } from '@/hooks/useLinks';
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/button';
import { 
  IconEye, 
  IconEyeOff, 
  IconZoomIn, 
  IconZoomOut, 
  IconRefresh,
  IconArrowsMinimize,
  IconArrowsMaximize,
  IconAdjustments
} from '@tabler/icons-react';
// @ts-expect-error - Type declarations for three
import * as THREE from 'three';
import { GraphData } from '@/types/graph';
import { Link } from '@/types/link';

// Define proper types for the graph elements
interface NodeObject {
  id: string;
  label?: string;
  content?: string;
  x?: number;
  y?: number;
  z?: number;
}

type Vec3 = {x?: number, y?: number, z?: number};

interface ForceGraphRef {
  cameraPosition: (position?: Vec3, lookAt?: Vec3, transitionMs?: number) => {x: number, y: number, z: number};
  zoomToFit: (durationMs?: number, padding?: number, nodeFilter?: (node: NodeObject) => boolean) => void;
}

interface GraphViewProps {
  userId?: string;
}

const GraphView = ({ userId = '' }: GraphViewProps) => {
  // Use clerk auth userId from localStorage as a fallback if not provided
  const effectiveUserId = userId || localStorage.getItem('clerkUserId') || '';
  
  const { notes, loading: notesLoading } = useNotes(effectiveUserId);
  const { links, loading: linksLoading } = useLinks({ userId: effectiveUserId });
  const { theme } = useTheme();
  const fgRef = useRef<ForceGraphRef>(null);

  // Graph configuration and UI state
  const [showLinks, setShowLinks] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [nodeSize, setNodeSize] = useState(5);
  const [linkWidth, setLinkWidth] = useState(1.5);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  // Convert notes and links data to the format expected by ForceGraph
  useEffect(() => {
    if (notesLoading || linksLoading) return;

    // Create nodes from notes
    const nodes = notes.map(note => ({
      id: note._id,
      label: note.title,
      content: note.content 
    }));

    // Create a map of note IDs for quick lookup
    const nodeMap = new Map(nodes.map(node => [node.id, true]));

    // Create links only between notes that exist in our nodes array
    const linksData = links
      .filter(link => 
        nodeMap.has(link.sourceNoteId) && nodeMap.has(link.targetNoteId)
      )
      .map(link => ({
        source: link.sourceNoteId,
        target: link.targetNoteId,
        type: link.type
      }));

    console.log(`Created graph with ${nodes.length} nodes and ${linksData.length} links`);
    setGraphData({ nodes, links: linksData });
  }, [notes, links, notesLoading, linksLoading]);

  // Node object hover state handler
  const handleNodeHover = useCallback((node: NodeObject | null) => {
    setHighlightedNode(node ? node.id : null);
    document.body.style.cursor = node ? 'pointer' : 'default';
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node: NodeObject) => {
    if (node) {
      console.log('Clicked node:', node);
      // Later: Add navigation to the note or other actions
    }
  }, []);

  // Center the graph
  const handleResetCamera = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 200 }, { x: 0, y: 0, z: 0 }, 1000);
    }
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (fgRef.current) {
      const currentDistance = fgRef.current.cameraPosition().z;
      fgRef.current.cameraPosition({ z: currentDistance * 0.8 }, undefined, 300);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (fgRef.current) {
      const currentDistance = fgRef.current.cameraPosition().z;
      fgRef.current.cameraPosition({ z: currentDistance * 1.2 }, undefined, 300);
    }
  }, []);

  // Loading state
  if (notesLoading || linksLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading graph data...</div>
      </div>
    );
  }

  // Empty state handling
  if (!notes.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-xl">No notes available to display in graph</div>
        <div className="text-sm text-muted-foreground">
          Create some notes to visualize connections between them
        </div>
      </div>
    );
  }

  // When there are notes but no links
  if (notes.length > 0 && (!links.length || graphData.links.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-xl">No connections between notes</div>
        <div className="text-sm text-muted-foreground">
          Your notes exist but don't have any connections between them.
          Create backlinks between notes to visualize their relationships here.
        </div>
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/notes'}
          >
            Go to Notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative bg-background">
      {/* Controls toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-card/80 backdrop-blur-sm p-2 rounded-lg shadow-lg flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          title={showLinks ? "Hide connections" : "Show connections"}
          onClick={() => setShowLinks(!showLinks)}
        >
          {showLinks ? <IconEye className="h-5 w-5" /> : <IconEyeOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          title={showLabels ? "Hide labels" : "Show labels"}
          onClick={() => setShowLabels(!showLabels)}
        >
          {showLabels ? <IconAdjustments className="h-5 w-5" /> : <IconAdjustments className="h-5 w-5 opacity-50" />}
        </Button>

        <div className="h-6 border-r border-border mx-1"></div>
        
        <Button
          variant="ghost"
          size="icon"
          title="Decrease node size"
          onClick={() => setNodeSize(Math.max(2, nodeSize - 1))}
        >
          <IconArrowsMinimize className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          title="Increase node size"
          onClick={() => setNodeSize(Math.min(15, nodeSize + 1))}
        >
          <IconArrowsMaximize className="h-5 w-5" />
        </Button>
        
        <div className="h-6 border-r border-border mx-1"></div>

        <Button
          variant="ghost"
          size="icon"
          title="Zoom in"
          onClick={handleZoomIn}
        >
          <IconZoomIn className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          title="Zoom out"
          onClick={handleZoomOut}
        >
          <IconZoomOut className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          title="Reset view"
          onClick={handleResetCamera}
        >
          <IconRefresh className="h-5 w-5" />
        </Button>
      </div>

      {/* Filter sidebar */}
      <div className="absolute top-4 right-4 z-10 bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-lg w-64">
        <h3 className="text-sm font-semibold mb-3">Filters</h3>
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Node size</label>
            <input 
              type="range" 
              min="2" 
              max="15" 
              value={nodeSize} 
              onChange={(e) => setNodeSize(Number(e.target.value))}
              className="w-full" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Link thickness</label>
            <input 
              type="range" 
              min="0.5" 
              max="5" 
              step="0.5"
              value={linkWidth} 
              onChange={(e) => setLinkWidth(Number(e.target.value))}
              className="w-full" 
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Show connections</span>
            <input 
              type="checkbox" 
              checked={showLinks} 
              onChange={() => setShowLinks(!showLinks)}
              className="rounded" 
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Show labels</span>
            <input 
              type="checkbox" 
              checked={showLabels} 
              onChange={() => setShowLabels(!showLabels)}
              className="rounded" 
            />
          </div>
          <div className="text-xs text-muted-foreground mt-4">
            {graphData.nodes.length} notes, {graphData.links.length} connections
          </div>
        </div>
      </div>

      {/* The Graph */}
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="label"
        backgroundColor={theme === 'dark' ? '#131313' : theme === 'light' ? '#f0f0f0' : '#ffffff'}
        linkVisibility={showLinks}
        nodeRelSize={nodeSize}
        linkWidth={linkWidth}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkColor={() => 'rgba(150, 100, 200, 0.6)'}
        nodeThreeObject={(node: NodeObject) => {
          const isHighlighted = highlightedNode === node.id;
          
          const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(nodeSize * (isHighlighted ? 1.4 : 1)),
            new THREE.MeshLambertMaterial({
              color: isHighlighted ? 0x7D50C8 : 0xAAAAAC,
              transparent: true,
              opacity: isHighlighted ? 1 : highlightedNode ? 0.5 : 0.8
            })
          );

          // Add label if enabled
          if (showLabels && node.label) {
            const sprite = new THREE.Sprite(
              new THREE.SpriteMaterial({
                map: new THREE.CanvasTexture((() => {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return canvas;
                  
                  const fontSize = Math.max(14, nodeSize * 2.5);
                  ctx.font = `${isHighlighted ? 'bold ' : ''}${fontSize}px Sans-Serif`;
                  
                  const textWidth = ctx.measureText(node.label).width;
                  const padding = 6;
                  
                  canvas.width = textWidth + 2 * padding;
                  canvas.height = fontSize + 2 * padding;
                  
                  ctx.font = `${isHighlighted ? 'bold ' : ''}${fontSize}px Sans-Serif`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  
                  // Semi-transparent background for better readability
                  if (isHighlighted) {
                    ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                  }
                  
                  ctx.fillStyle = isHighlighted ? '#FFFFFF' : '#CCCCCC';
                  ctx.fillText(node.label, canvas.width / 2, canvas.height / 2);
                  
                  return canvas;
                })())
              })
            );
            
            sprite.position.y = -(nodeSize * 1.5);
            sprite.scale.set(30, 15, 1);
            
            // Create a group and add both sphere and text
            const group = new THREE.Group();
            group.add(sphere);
            group.add(sprite);
            return group;
          }
          
          return sphere;
        }}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current?.zoomToFit(400)}
      />
    </div>
  );
};

export default GraphView; 