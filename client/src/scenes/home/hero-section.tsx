import { Button } from "@/components/ui/button"
import { InteractiveGrid } from "@/components/interactive-grid"
import { ShineBorder } from "@/components/shine-border"
import { Play } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function HeroSection() {
    const navigate = useNavigate()
  return (
    <section className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-black">
      <InteractiveGrid containerClassName="absolute inset-0" className="opacity-30" points={40} />

      <ShineBorder
        className="relative z-10 max-w-6xl mx-auto px-6"
        borderClassName="border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Take Smarter Notes 
            <br />
            Easily Visualize Data
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            The web-based, markdown notebook that supercharges note-taking with GenAI          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10" onClick={() => navigate("/demo")}>
              <Play className="w-4 h-4" />
              Demo Tangent
            </Button>
            <Button variant="secondary" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium" onClick={() => navigate("/integrations")}>
              Sign Up
            </Button>
          </div>
        </div>

        <ShineBorder className="relative mx-auto" borderClassName="border border-white/10 rounded-xl overflow-hidden">
          <div className="relative">
            <img
              src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/373/943/datas/gallery.jpg"
              alt="Tangnt Home Screen"
              width={1920}
              height={1080}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 flex items-end justify-center pb-16">
              <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl w-[90%] h-[70%] flex">
                <div className="flex-1 pr-2">
                  <img
                    src="https://hallofdoors.com/static/img/obsidian.png"
                    alt="Obsidian Graph Wiew"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 pl-2">
                  <img
                    src="https://mdg.imgix.net/assets/images/tools/obsidian.png"
                    alt="Obsidian Notes and Graph View"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </ShineBorder>
      </ShineBorder>
    </section>
  )
}
