import { Routes, Route} from "react-router-dom";
import Home from "./scenes/home";
import NotFoundError from "./scenes/pages/not-found-error";
import ComingSoon from "./scenes/pages/coming-soon";
import Footer from "./components/global/footer";
import Notes from "./scenes/notes";
import NotesPage from "./scenes/notes/notes-page";
import Navbar from "./components/global/navbar";
import { ThemeProvider } from "./providers/ThemeProvider";
import Networks from "./scenes/network";
// import Games from "./scenes/games";
import GraphView from "./scenes/network/GraphView";
import Tetris from "./scenes/games/tetris";
import Charts from "./scenes/charts";
import ChartsView from "./scenes/charts/ChartsView";

function AppRoutes() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-16">
          <Routes>
            <Route path="*" element={<NotFoundError/>} />
            <Route path="/" element={<Home/>} />
            <Route path="/notes" element={<Notes />}>
              <Route index element={<NotesPage />} /> {/* Default note editor/writing page (similar to obsidian UI/UX) */}
              <Route path="edit" element={<NotesPage/>} />    {/* Route for modifying and deletion page with users notes */}
              <Route path="create" element={<ComingSoon/>} />    {/* Route for creating/importing new note */}
              <Route path="*" element={<NotFoundError />} />
            </Route>
            <Route path="/charts" element={<Charts />}>
              <Route index element={<ChartsView />} /> {/*  */}
              <Route path="view" element={<ComingSoon/>} />    {/*  */}
              <Route path="create" element={<ComingSoon/>} />    {/*  */}
              <Route path="*" element={<NotFoundError />} />
            </Route>
            <Route path="/networks" element={<Networks />}>
              <Route index element={<GraphView />} /> {/* Default route for backlink connection visualizations */}
              <Route path="*" element={<NotFoundError />} />
            </Route>
            <Route path="/integrations" element={<Notes />}>
              <Route index element={<ComingSoon />} /> {/* Default note editor/writing page (similar to obsidian UI/UX) */}
              <Route path="*" element={<NotFoundError />} />
            </Route>
            {/* <Route path="/games" element={<Games />}>
              <Route index element={<Tetris />} /> 
              <Route path="*" element={<NotFoundError />} />
            </Route> */}
            <Route path="/documentation" element={<ComingSoon />}>
              <Route index element={<ComingSoon />} /> {/*  */}
              <Route path="startup" element={<ComingSoon/>} />    {/* */}
              <Route path="installation" element={<ComingSoon/>} />    {/* */}
              <Route path="API" element={<ComingSoon/>} />    {/* */}
              <Route path="*" element={<NotFoundError />} />
            </Route>
            <Route path="/" element={<Home/>} />
            <Route path="/games" element={<Tetris />} />
            <Route path="/tangent" element={<ComingSoon />} />
            <Route path="/about" element={<ComingSoon/>} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default AppRoutes;
