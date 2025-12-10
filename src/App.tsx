import { FileUploadComponent } from "@/components/FileUpload"
import { SelectBeReplaced, type ReplacementOption } from "@/components/SelectBeReplaced"
import { useState } from "react"

function App() {
  const [selectedOptions, setSelectedOptions] = useState<Set<ReplacementOption>>(new Set())

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <div className="w-full max-w-md space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-3">Select Replacement Options</h2>
          <SelectBeReplaced onSelectionChange={setSelectedOptions} />
        </div>
        <FileUploadComponent replacementOptions={selectedOptions} />
      </div>
    </div>
  )
}

export default App
