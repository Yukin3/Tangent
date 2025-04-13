import { Button } from "@/components/ui/button"
import { integrationImages } from "@/constants/images"
import { useNavigate } from "react-router-dom"

export function IntegrationSection() {
    const navigate = useNavigate()
    const integrations = integrationImages.map((url, i) => ({
        name: `Integration ${i + 1}`,
        icon: url,
      }))
    

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Seamless Integration for Any Workflow</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Whether you use Notion, Slack, or any other collaboration tool, Crop Studio seamlessly integrates with your
          existing workflow to enhance your screen sharing experience.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {integrations.map((integration, index) => (
            <img
              key={index}
              src={integration.icon || "/placeholder.svg"}
              alt={integration.name}
              width={48}
              height={48}
              className="rounded-lg"
            />
          ))}
        </div>
        <div className="mt-12 flex gap-4 justify-center">
        <Button size="lg" onClick={() => navigate("/integrations")}>Connect</Button>
        <Button variant="outline" size="lg" onClick={() => navigate("/documentation")}>Documentation </Button>
        </div>
      </div>
    </section>
  )
}
