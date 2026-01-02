import { FileUploadComponent } from "@/components/Documents/FileUpload"
import { SelectBeReplaced, type ReplacementOption } from "@/components/Documents/SelectBeReplaced"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { YouTubeSubtitle } from "@/components/YTSubtitle/YouTubeSubtitle"

function App() {
  const [selectedOptions, setSelectedOptions] = useState<Set<ReplacementOption>>(new Set())

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <div className="w-full max-w-md space-y-4">
        <Tabs defaultValue="document" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="document" className="flex-1">Document</TabsTrigger>
            <TabsTrigger value="youtube-subtitle" className="flex-1">YouTube Subtitle</TabsTrigger>
          </TabsList>
          <TabsContent value="document" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Replacement Options</CardTitle>
              </CardHeader>
              <CardContent>
                <SelectBeReplaced onSelectionChange={setSelectedOptions} />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <FileUploadComponent replacementOptions={selectedOptions} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="youtube-subtitle" className="mt-4">
            <YouTubeSubtitle />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
